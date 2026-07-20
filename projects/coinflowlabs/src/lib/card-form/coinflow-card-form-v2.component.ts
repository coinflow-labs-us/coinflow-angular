import {
  Component,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {NgStyle} from '@angular/common';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import LZString from 'lz-string';
import {
  CardFormVariant,
  CoinflowEnvs,
  CoinflowUtils,
  getSkeletonColors,
  getSkeletonGridTemplate,
  guessSkeletonHeightPx,
  IFrameMessageMethods,
  INLINE_SKELETON_HEIGHT_PX,
  MerchantTheme,
  SKELETON_BOX_STYLE,
  SKELETON_FADE_MS,
  SKELETON_LAYOUTS,
  SKELETON_ROOT_PADDING_PX,
  SkeletonLayout,
} from '../common';

export interface CardFormArgs {
  merchantId: string;
  env?: CoinflowEnvs;
  theme?: MerchantTheme;
  variant: CardFormVariant;
  token?: string;
  onLoad?: () => void;
}

export interface CardFormTokenResponse {
  token: string;
  expMonth?: string;
  expYear?: string;
}

@Component({
  selector: 'lib-coinflow-card-form',
  standalone: true,
  imports: [NgStyle],
  styles: [
    `
      @keyframes coinflow-card-form-skeleton-pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.4;
        }
      }
    `,
  ],
  template: `<div
    #wrapper
    [style.position]="'relative'"
    [style.width]="'100%'"
    [style.height]="height"
  >
    @if (rendered) {
    <div
      role="status"
      aria-label="Loading card form"
      (transitionend)="onSkeletonTransitionEnd($event)"
      [ngStyle]="skeletonRootStyle"
    >
      <div [ngStyle]="gridStyle">
        @for (area of areas; track area) {
        <div [ngStyle]="boxStyle(area)"></div>
        }
      </div>
    </div>
    }
    <iframe
      #cardFormIframe
      [src]="url"
      title="Card Form"
      frameBorder="0"
      allow="payment"
      [style.width]="'100%'"
      [style.height]="height"
      [style.border]="'none'"
      [style.opacity]="loaded ? 1 : 0"
      [style.transition]="'opacity 300ms linear, height 150ms ease-out'"
    ></iframe>
  </div>`,
})
export class CoinflowCardForm implements OnInit, OnDestroy {
  @Input() args!: CardFormArgs;
  @ViewChild('cardFormIframe', {static: true})
  iframeRef!: ElementRef<HTMLIFrameElement>;
  @ViewChild('wrapper', {static: true})
  wrapperRef!: ElementRef<HTMLElement>;

  url?: SafeResourceUrl;
  loaded = false;
  iframeHeight: number | null = null;

  // Guess the skeleton height/layout from the iframe's width until it reports
  // its real height: compact (stacked) layouts are twice as tall as inline.
  private layout!: SkeletonLayout;
  areas: string[] = [];
  private guessHeight = INLINE_SKELETON_HEIGHT_PX;
  private gridTemplate = '';

  // Keep the skeleton mounted while it fades out so the opacity transition can
  // play, then unmount on transition end. Remount instantly when shown again.
  rendered = true;

  private observer: ResizeObserver | null = null;
  private unmountTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private sanitizer: DomSanitizer, private zone: NgZone) {}

  ngOnInit() {
    this.layout = SKELETON_LAYOUTS[this.args.variant];
    this.areas = this.layout.areas;
    this.gridTemplate = this.layout.inline;
    this.buildUrl();
    this.observeWidth();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    if (this.unmountTimer) clearTimeout(this.unmountTimer);
  }

  get height(): string {
    return this.loaded && this.iframeHeight
      ? `${this.iframeHeight}px`
      : `${this.guessHeight}px`;
  }

  get skeletonRootStyle() {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      pointerEvents: 'none',
      flexDirection: 'column',
      gap: '8px',
      padding: `${SKELETON_ROOT_PADDING_PX}px`,
      boxSizing: 'border-box',
      borderRadius: '8px',
      background: this.skeletonColors.backdrop,
      opacity: this.loaded ? '0%' : '100%',
      transition: 'opacity 300ms linear, height 150ms ease-out',
    };
  }

  get gridStyle() {
    return {
      display: 'grid',
      gap: 0,
      flex: 1,
      width: '100%',
      gridTemplate: this.gridTemplate,
    };
  }

  // Best-effort skeleton tint from the merchant theme's background (neutral when
  // absent), so the loader reads on light and dark forms alike.
  get skeletonColors() {
    return getSkeletonColors(this.args.theme);
  }

  boxStyle(area: string) {
    return {
      ...SKELETON_BOX_STYLE,
      background: this.skeletonColors.box,
      gridArea: area,
    };
  }

  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
    // Only honor messages from THIS instance's iframe. Multiple card forms on
    // one page each listen on `window`, so without this every instance would
    // apply every other iframe's height/loaded events to itself.
    if (event.source !== this.iframeRef?.nativeElement?.contentWindow) return;
    this.handleMessage(event.data, event.origin);
  }

  onSkeletonTransitionEnd(e: TransitionEvent) {
    if (e.propertyName === 'opacity' && this.loaded) this.rendered = false;
  }

  private observeWidth() {
    // Measure the wrapper div, not the iframe: a freshly-mounted <iframe> is a
    // replaced element with an intrinsic 300px default width before its
    // width:100% resolves, which would briefly (and wrongly) trip the compact
    // breakpoint. A block div reports the true container width immediately.
    const el = this.wrapperRef?.nativeElement;
    if (!el || !this.layout.compact) return;

    const measure = () => {
      const width = el.clientWidth;
      this.guessHeight = guessSkeletonHeightPx({
        variant: this.args.variant,
        width,
      });
      this.gridTemplate = getSkeletonGridTemplate({
        variant: this.args.variant,
        width,
      });
    };
    measure();
    this.observer = new ResizeObserver(() => this.zone.run(measure));
    this.observer.observe(el);
  }

  private buildUrl() {
    const baseUrl = CoinflowUtils.getCoinflowBaseUrl(this.args.env);
    const iframeUrl = new URL(`/form/v2/${this.args.variant}`, baseUrl);
    iframeUrl.searchParams.append('merchantId', this.args.merchantId);
    iframeUrl.searchParams.append('useHeightChange', 'true');
    if (this.args.theme) {
      iframeUrl.searchParams.append(
        'theme',
        LZString.compressToEncodedURIComponent(JSON.stringify(this.args.theme))
      );
    }
    if (this.args.token) {
      iframeUrl.searchParams.append('token', this.args.token);
    }
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
      iframeUrl.toString()
    );
  }

  private handleMessage(data: string, origin: string) {
    const expectedOrigin = new URL(
      CoinflowUtils.getCoinflowBaseUrl(this.args.env)
    ).origin;
    if (origin !== expectedOrigin) return;
    try {
      const parsed = JSON.parse(data);
      if (parsed.method === IFrameMessageMethods.Loaded) {
        this.loaded = true;
        this.args.onLoad?.();
        // Fallback unmount: `transitionend` may never fire (reduced-motion, an
        // ancestor display:none, or opacity already 0), so force cleanup after
        // the fade window.
        if (this.unmountTimer) clearTimeout(this.unmountTimer);
        this.unmountTimer = setTimeout(() => {
          this.zone.run(() => (this.rendered = false));
        }, SKELETON_FADE_MS);
      } else if (parsed.method === IFrameMessageMethods.HeightChange) {
        const parsedHeight = Number(parsed.data);
        if (Number.isFinite(parsedHeight) && parsedHeight > 0) {
          this.iframeHeight = parsedHeight;
        }
      }
    } catch {
      // not JSON
    }
  }

  tokenize(): Promise<CardFormTokenResponse> {
    return new Promise((resolve, reject) => {
      const iframe = this.iframeRef?.nativeElement;
      if (!iframe?.contentWindow) {
        reject(new Error('Card form iframe not loaded'));
        return;
      }

      const handler = (event: MessageEvent) => {
        const {data, origin} = event;
        const expectedOrigin = new URL(
          CoinflowUtils.getCoinflowBaseUrl(this.args.env)
        ).origin;
        if (origin !== expectedOrigin) return;
        try {
          const parsed = JSON.parse(data);
          if (parsed.method !== 'tokenize') return;

          window.removeEventListener('message', handler);

          if (
            typeof parsed.data === 'string' &&
            parsed.data.startsWith('ERROR')
          ) {
            reject(new Error(parsed.data.replace('ERROR ', '')));
            return;
          }

          const responseData =
            typeof parsed.data === 'string'
              ? JSON.parse(parsed.data)
              : parsed.data;
          resolve(responseData);
        } catch {
          // not relevant
        }
      };

      window.addEventListener('message', handler);
      const targetOrigin = new URL(
        CoinflowUtils.getCoinflowBaseUrl(this.args.env)
      ).origin;
      iframe.contentWindow.postMessage('tokenize', targetOrigin);
    });
  }
}

/** @deprecated Use CoinflowCardForm instead */
export const CoinflowCardFormV2 = CoinflowCardForm;
