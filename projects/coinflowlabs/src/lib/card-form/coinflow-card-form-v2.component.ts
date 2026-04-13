import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import LZString from 'lz-string';
import {
  CoinflowEnvs,
  CoinflowUtils,
  IFrameMessageMethods,
  MerchantTheme,
} from '../common';

export interface CardFormArgs {
  merchantId: string;
  env?: CoinflowEnvs;
  theme?: MerchantTheme;
  variant: 'card-form' | 'card-number-form' | 'cvv-form';
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
  imports: [],
  template: `<iframe
    #cardFormIframe
    [src]="url"
    title="Card Form"
    frameBorder="0"
    allow="payment"
    [style.width]="'100%'"
    [style.height]="'60px'"
    [style.border]="'none'"
    [style.opacity]="loaded ? 1 : 0"
    [style.transition]="'opacity 300ms linear'"
  ></iframe>`,
})
export class CoinflowCardForm implements OnInit, OnDestroy {
  @Input() args!: CardFormArgs;
  @ViewChild('cardFormIframe', {static: true})
  iframeRef!: ElementRef<HTMLIFrameElement>;

  url = '';
  loaded = false;
  private messageHandler: ((event: MessageEvent) => void) | undefined;

  ngOnInit() {
    this.buildUrl();
    this.messageHandler = (event: MessageEvent) =>
      this.handleMessage(event.data, event.origin);
    window.addEventListener('message', this.messageHandler);
  }

  ngOnDestroy() {
    if (this.messageHandler) {
      window.removeEventListener('message', this.messageHandler);
    }
  }

  private buildUrl() {
    const baseUrl = CoinflowUtils.getCoinflowBaseUrl(this.args.env);
    const iframeUrl = new URL(
      `/form/v2/${this.args.variant}`,
      baseUrl
    );
    iframeUrl.searchParams.append('merchantId', this.args.merchantId);
    if (this.args.theme) {
      iframeUrl.searchParams.append(
        'theme',
        LZString.compressToEncodedURIComponent(
          JSON.stringify(this.args.theme)
        )
      );
    }
    if (this.args.token) {
      iframeUrl.searchParams.append('token', this.args.token);
    }
    this.url = iframeUrl.toString();
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
      const targetOrigin = new URL(CoinflowUtils.getCoinflowBaseUrl(this.args.env)).origin;
      iframe.contentWindow.postMessage('tokenize', targetOrigin);
    });
  }
}

/** @deprecated Use CoinflowCardForm instead */
export const CoinflowCardFormV2 = CoinflowCardForm;
