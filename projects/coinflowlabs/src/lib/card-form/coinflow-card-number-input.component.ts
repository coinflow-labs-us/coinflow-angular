import {Component, inject, Input, OnDestroy} from '@angular/core';
import {
  CoinflowCardNumberInputProps,
  MerchantIdOrCheckoutJwt,
  setTokenExScriptTag,
  TokenExCardNumberIframeId,
  TokenExIframe,
} from '../common';
import {CardFormService} from './CardFormService';

@Component({
  selector: 'lib-coinflow-card-number-input',
  standalone: true,
  imports: [],
  template: '<div id="{{TokenExCardNumberIframeId}}"></div>',
})
export class CoinflowCardNumberInput implements OnDestroy {
  private cardFormService = inject(CardFormService);
  @Input() args!: CoinflowCardNumberInputProps & MerchantIdOrCheckoutJwt;
  private iframe: TokenExIframe | undefined = undefined;

  private onScriptLoaded() {
    this.cardFormService
      .initializeTokenExIframe({
        ...this.args,
        css: JSON.stringify(this.args.css),
      })
      .then(iframe => (this.iframe = iframe))
      .catch(e => console.error(e));
  }

  private initializeTokenEx() {
    setTokenExScriptTag({
      env: this.args.env,
      setTokenExScriptLoaded: this.onScriptLoaded.bind(this),
    });
  }

  public reinitialize() {
    this.iframe = undefined;
    this.initializeTokenEx();
  }

  ngOnInit() {
    this.initializeTokenEx();
  }

  ngOnDestroy() {
    this.iframe = undefined;
  }

  tokenize() {
    return this.iframe!.tokenize();
  }

  protected readonly TokenExCardNumberIframeId = TokenExCardNumberIframeId;
}
