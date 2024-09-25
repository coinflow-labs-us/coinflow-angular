import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  CoinflowIFrameProps,
  CoinflowUtils,
  IFrameMessageHandlers,
  handleIFrameMessage,
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
    scrolling="{{ iframeProps?.handleHeightChange ? 'no' : 'yes' }}"
    allow="payment;camera"
    title="withdraw"
    frameBorder="0"
    [src]="dynamicUrl"
  ></iframe>`,
})
export class CoinflowIFrameComponent {
  @Input() iframeProps!: CoinflowIFrameProps;
  @Input() messageHandlers!: IFrameMessageHandlers;

  @Output() messageEvent = new EventEmitter<any>();

  dynamicUrl?: SafeResourceUrl;
  @ViewChild('iframe') iframe?: ElementRef<HTMLIFrameElement>;

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

    const promise = handleIFrameMessage(event.data, this.messageHandlers);
    if (!promise) return;
    promise
      .then(this.sendMessage.bind(this))
      .catch(e => this.sendMessage('ERROR ' + e.message));
  }

  sendMessage(message: string) {
    if (!this.iframe || !this.iframe.nativeElement) return;
    this.iframe.nativeElement.contentWindow!.postMessage(message, '*');
  }
}
