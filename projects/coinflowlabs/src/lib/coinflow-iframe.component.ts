import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  CoinflowIFrameProps,
  CoinflowUtils,
  handleIFrameMessage,
  IFrameMessageHandlers,
} from './common';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'lib-coinflow-iframe',
  standalone: true,
  imports: [],
  template: ` <iframe
    width="100%"
    height="100%"
    #iframe
    scrolling="{{ iframeProps?.handleHeightChangeId ? 'no' : 'yes' }}"
    allow="payment;camera;clipboard-write"
    title="withdraw"
    frameBorder="0"
    [src]="dynamicUrl"
    credentialless
    (load)="handleIframeLoad()"
  ></iframe>`,
})
export class CoinflowIFrameComponent {
  @Input() iframeProps!: CoinflowIFrameProps;
  @Input() messageHandlers!: IFrameMessageHandlers;
  @Input() onLoad?: () => void | Promise<void>;
  @Input() waitForLoadedMessage?: boolean;

  @Output() messageEvent = new EventEmitter<any>();

  dynamicUrl?: SafeResourceUrl;
  @ViewChild('iframe') iframe?: ElementRef<HTMLIFrameElement>;
  private isLoading = true;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    const coinflowUrl = CoinflowUtils.getCoinflowUrl(this.iframeProps);
    this.dynamicUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(coinflowUrl);
  }

  @HostListener('window:message', ['$event']) onPostMessage(event: any) {
    if (
      !event.origin.includes(
        CoinflowUtils.getCoinflowBaseUrl(this.iframeProps.env)
      )
    )
      return;

    this.messageEvent.emit(event);

    if (this.waitForLoadedMessage) {
      try {
        const message = JSON.parse(event.data);
        if (
          message &&
          typeof message === 'object' &&
          message.method === 'loaded'
        ) {
          this.isLoading = false;
          this.onLoad?.();
        }
      } catch (error) {
        // Ignore parse errors
      }
    }

    const promise = handleIFrameMessage(
      event.data,
      this.messageHandlers,
      this.iframeProps.handleHeightChangeId
    );
    if (!promise) return;
    promise
      .then(this.sendMessage.bind(this))
      .catch(e => this.sendMessage('ERROR ' + e.message));
  }

  sendMessage(message: string) {
    if (!this.iframe || !this.iframe.nativeElement) return;
    this.iframe.nativeElement.contentWindow!.postMessage(message, '*');
  }

  handleIframeLoad() {
    if (this.waitForLoadedMessage) return;

    this.isLoading = false;
    this.onLoad?.();
  }
}
