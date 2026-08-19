import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {CoinflowIFrameComponent} from '../coinflow-iframe.component';
import {
  CoinflowIFrameProps,
  CoinflowPurchaseProps,
  CoinflowUtils,
  getHandlers,
  getWalletPubkey,
  IFrameMessageHandlers,
  IFrameMessageMethods,
  Subtotal,
} from '../common';
import {WithOnLoad} from '../../public-api';

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
        [onLoad]="purchaseProps?.onLoad"
        [waitForLoadedMessage]="true"
      ></lib-coinflow-iframe>
    </div>
  </div>`,
})
export class CoinflowMobileWalletButtonComponent implements OnChanges {
  @Input() purchaseProps!: CoinflowPurchaseProps &
    WithOnLoad & {
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

  @ViewChild(CoinflowIFrameComponent)
  private iframeComponent?: CoinflowIFrameComponent;

  // The subtotal is pinned to its initial value in the iframe URL (built once
  // in ngOnInit) so amount changes don't force a reload. Updates are instead
  // sent to the running iframe via postMessage once it has loaded.
  private loaded = false;
  private lastSentSubtotal?: string;
  private pendingSubtotal?: Subtotal;

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

        this.loaded = true;
        if (this.pendingSubtotal) {
          const pendingSubtotal = this.pendingSubtotal;
          this.pendingSubtotal = undefined;
          this.sendSubtotalUpdate(pendingSubtotal);
        }
      }
    } catch (e) {}
  }

  ngOnChanges(changes: SimpleChanges) {
    const purchasePropsChange = changes['purchaseProps'];
    if (!purchasePropsChange || purchasePropsChange.firstChange) return;

    const subtotal: Subtotal | undefined =
      purchasePropsChange.currentValue?.subtotal;
    if (!subtotal) return;

    this.sendSubtotalUpdate(subtotal);
  }

  private sendSubtotalUpdate(subtotal: Subtotal) {
    if (!this.loaded) {
      this.pendingSubtotal = subtotal;
      return;
    }

    const serializedSubtotal = JSON.stringify(subtotal);
    if (this.lastSentSubtotal === serializedSubtotal) return;

    this.lastSentSubtotal = serializedSubtotal;
    this.iframeComponent?.sendMessage(
      `${IFrameMessageMethods.UpdateSubtotal}:${serializedSubtotal}`
    );
  }

  ngOnInit() {
    this.lastSentSubtotal = JSON.stringify(this.purchaseProps?.subtotal);
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
