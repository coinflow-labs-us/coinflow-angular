import {Component, Input} from '@angular/core';
import {CoinflowPurchaseProps} from '../common';
import {CoinflowMobileWalletButtonComponent} from './coinflow-mobile-wallet-button.component';
import {CoinflowGooglePayOverlayComponent} from './google-pay-overlay.component';

@Component({
  selector: 'lib-coinflow-google-pay-button',
  standalone: true,
  imports: [
    CoinflowMobileWalletButtonComponent,
    CoinflowGooglePayOverlayComponent,
  ],
  template: `<lib-coinflow-mobile-wallet-button
    ng-if="iframeProps && messageHandlers"
    [purchaseProps]="purchaseProps"
    route="google-pay"
    alignItems="center"
    overlayDisplayOverride="flex"
  >
    <coinflow-google-pay-overlay
      [color]="purchaseProps.color"
    ></coinflow-google-pay-overlay>
  </lib-coinflow-mobile-wallet-button> `,
})
export class CoinflowGooglePayButtonComponent {
  @Input() purchaseProps!: CoinflowPurchaseProps & {color: 'white' | 'black'};
}
