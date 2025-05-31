import {Component, Input} from '@angular/core';
import {
  CoinflowIFrameProps,
  CoinflowWithdrawProps,
  getHandlers,
  getWalletPubkey,
  IFrameMessageHandlers,
} from './common';
import {CoinflowIFrameComponent} from './coinflow-iframe.component';

@Component({
  selector: 'lib-coinflow-withdraw',
  standalone: true,
  imports: [CoinflowIFrameComponent],
  template:
    '  <lib-coinflow-iframe ng-if="iframeProps && messageHandlers" [iframeProps]="iframeProps!" [messageHandlers]="messageHandlers!"></lib-coinflow-iframe> ',
})
export class CoinflowWithdrawComponent {
  @Input() withdrawProps!: CoinflowWithdrawProps;
  iframeProps?: CoinflowIFrameProps;
  messageHandlers?: IFrameMessageHandlers;

  ngOnInit() {
    const walletPubkey = getWalletPubkey(this.withdrawProps);
    this.messageHandlers = getHandlers(this.withdrawProps);
    this.messageHandlers.handleHeightChange =
      this.withdrawProps.handleHeightChange;

    const handleHeightChangeId = Math.random().toString(16).substring(2);

    this.iframeProps = {
      ...this.withdrawProps,
      walletPubkey,
      route: `/withdraw/${this.withdrawProps?.merchantId}`,
      transaction: undefined,
      handleHeightChangeId,
    };
  }
}
