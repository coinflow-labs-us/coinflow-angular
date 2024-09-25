import {Component, inject, Input} from '@angular/core';
import {
  CoinflowCvvOnlyInputProps,
  setTokenExScriptTag,
  TokenExCvvContainerID,
  TokenExIframe,
} from '../common';
import {CardFormService} from './CardFormService';

@Component({
  selector: 'lib-coinflow-cvv-only-input',
  standalone: true,
  imports: [],
  template: '<div id="{{TokenExCvvContainerID}}"></div>',
})
export class CoinflowCvvOnlyInputComponent {
  private cardFormService = inject(CardFormService);
  @Input() args!: CoinflowCvvOnlyInputProps;
  private iframe: TokenExIframe | undefined = undefined;

  private onScriptLoaded() {
    this.cardFormService
      .initializeCvvOnlyTokenExIframe(this.args.env, {
        css: JSON.stringify(this.args.css),
        debug: this.args.debug,
        origins: this.args.origins,
        font: this.args.font,
        token: this.args.token,
        cardType: this.args.cardType,
      })
      .then(iframe => (this.iframe = iframe))
      .catch(e => console.error(e));
  }

  ngOnInit() {
    setTokenExScriptTag({
      env: this.args.env,
      setTokenExScriptLoaded: this.onScriptLoaded.bind(this),
    });
  }

  tokenize() {
    return this.iframe!.tokenize();
  }

  protected readonly TokenExCvvContainerID = TokenExCvvContainerID;
}
