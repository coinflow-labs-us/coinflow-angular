import {Component, Input} from '@angular/core';
import {CoinflowIFrameComponent} from './coinflow-iframe.component';
import {
  CoinflowIFrameProps,
  CoinflowPurchaseProps,
  IFrameMessageHandlers,
  getHandlers,
  getWalletPubkey,
  CoinflowUtils,
} from './common';

@Component({
  selector: 'lib-coinflow-purchase',
  standalone: true,
  imports: [CoinflowIFrameComponent],
  template:
    ' <lib-coinflow-iframe ng-if="iframeProps && messageHandlers" [iframeProps]="iframeProps!" [messageHandlers]="messageHandlers!"></lib-coinflow-iframe> ',
})
export class CoinflowPurchaseComponent {
  @Input() purchaseProps!: CoinflowPurchaseProps;
  iframeProps?: CoinflowIFrameProps;
  messageHandlers?: IFrameMessageHandlers;

  ngOnInit() {
    const walletPubkey = getWalletPubkey(this.purchaseProps);
    this.messageHandlers = getHandlers(this.purchaseProps);
    this.messageHandlers.handleHeightChange =
      this.purchaseProps.handleHeightChange;

    const handleHeightChangeId = Math.random().toString(16).substring(2);

    this.iframeProps = {
      ...this.purchaseProps,
      walletPubkey,
      route: `/purchase-v2/${this.purchaseProps?.merchantId}`,
      transaction: CoinflowUtils.getTransaction(this.purchaseProps),
      handleHeightChangeId,
    };
  }
}
