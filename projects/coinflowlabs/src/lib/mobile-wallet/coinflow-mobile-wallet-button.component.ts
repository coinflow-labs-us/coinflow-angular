import {Component, Input} from '@angular/core';
import {CoinflowIFrameComponent} from '../coinflow-iframe.component';
import {
  CoinflowIFrameProps,
  CoinflowPurchaseProps,
  CoinflowUtils,
  getHandlers,
  getWalletPubkey,
  IFrameMessageHandlers,
} from '../common';

@Component({
  selector: 'lib-coinflow-mobile-wallet-button',
  standalone: true,
  imports: [CoinflowIFrameComponent],
  template: ` <div style="position: relative; height: 100%;">
    <div
      [style.background-color]="purchaseProps.color"
      [style.display]="overlayDisplayOverride ?? display"
      [style.opacity]="opacity"
      [style.align-items]="alignItems"
      style="width: 100%; height: 40px; position: absolute; top: 0; bottom: 0; left: 0; z-index: 20; justify-content: center; pointer-events: none;"
    >
      <ng-content></ng-content>
    </div>
    <div style="position: relative; z-index: 10; height: 100%;">
      <lib-coinflow-iframe
        (messageEvent)="handleMessage($event)"
        ng-if="iframeProps && messageHandlers"
        [iframeProps]="iframeProps!"
        [messageHandlers]="messageHandlers!"
      ></lib-coinflow-iframe>
    </div>
  </div>`,
})
export class CoinflowMobileWalletButtonComponent {
  @Input() purchaseProps!: CoinflowPurchaseProps & {
    color: 'white' | 'black';
    onError?: (message: string) => void;
  };

  @Input() route!: string;
  @Input() overlayDisplayOverride: string | undefined;
  @Input() alignItems: string | undefined;
  opacity: number = 0.8;
  display: string = 'flex';

  iframeProps?: CoinflowIFrameProps;
  messageHandlers?: IFrameMessageHandlers;

  handleMessage({data}: {data: string}) {
    try {
      const res = JSON.parse(data);

      console.log({data});
      if ('method' in res && res.data.startsWith('ERROR')) {
        this.purchaseProps.onError?.(res.info);
        return;
      }

      if ('method' in res && res.method === 'loaded') {
        this.opacity = 1;
        setTimeout(() => {
          this.display = 'none';
        }, 2000);
      }
    } catch (e) {}
  }

  ngOnInit() {
    const walletPubkey = getWalletPubkey(this.purchaseProps);
    this.messageHandlers = getHandlers(this.purchaseProps);
    this.messageHandlers.handleHeightChange =
      this.purchaseProps.handleHeightChange;

    const handleHeightChangeId = Math.random().toString(16).substring(2);

    this.iframeProps = {
      ...this.purchaseProps,
      walletPubkey,
      route: `/${this.route}/${this.purchaseProps?.merchantId}`,
      routePrefix: 'form',
      transaction: CoinflowUtils.getTransaction(this.purchaseProps),
      handleHeightChangeId,
    };
  }
}
