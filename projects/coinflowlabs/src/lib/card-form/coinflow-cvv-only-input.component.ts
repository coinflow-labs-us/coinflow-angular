import {
  Component,
  inject,
  Input,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
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
export class CoinflowCvvOnlyInputComponent implements OnDestroy {
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
      .then(iframe => {
        this.iframe = iframe;
      })
      .catch(e => console.error(e));
  }

  private cleanup() {
    if (this.iframe) {
      const iframeElement = document.querySelector(`#${TokenExCvvContainerID}`);
      if (iframeElement) iframeElement.innerHTML = '';
      this.iframe = undefined;
    }
  }

  private initializeTokenEx() {
    setTokenExScriptTag({
      env: this.args.env,
      setTokenExScriptLoaded: this.onScriptLoaded.bind(this),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.args && !changes.args.firstChange) {
      this.reinitialize();
    }
  }

  public reinitialize() {
    this.cleanup();
    setTimeout(() => {
      this.initializeTokenEx();
    }, 500);
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

  protected readonly TokenExCvvContainerID = TokenExCvvContainerID;
}
