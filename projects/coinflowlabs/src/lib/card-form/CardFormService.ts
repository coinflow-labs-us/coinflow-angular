import {
  doInitializeCvvOnlyTokenExIframe,
  doInitializeTokenExCardOnlyIframe,
  doInitializeTokenExIframe,
  TokenExIframe,
  CoinflowEnvs,
} from '../common';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CardFormService {
  loaded = false;
  tokenExIframe: TokenExIframe | undefined = undefined;

  setTokenExIframe(iframe: TokenExIframe | undefined) {
    this.tokenExIframe = iframe;
  }

  setCachedToken() {}

  setLoaded(input: boolean) {
    this.loaded = input;
  }

  async initializeCvvOnlyTokenExIframe(
    env: CoinflowEnvs,
    args: Omit<
      Parameters<typeof doInitializeCvvOnlyTokenExIframe>[0],
      'env' | 'tokenExScriptLoaded' | 'setCachedToken' | 'setLoaded'
    >
  ) {
    const iframe = await doInitializeCvvOnlyTokenExIframe({
      ...args,
      tokenExScriptLoaded: true,
      env,
      setCachedToken: this.setCachedToken.bind(this),
      setLoaded: this.setLoaded.bind(this),
    });
    this.setTokenExIframe(iframe);
    if (iframe) iframe.load();
    return iframe;
  }

  async initializeTokenExIframe(
    env: CoinflowEnvs,
    args: Omit<
      Parameters<typeof doInitializeTokenExIframe>[0],
      'env' | 'tokenExScriptLoaded' | 'setCachedToken' | 'setLoaded'
    >
  ) {
    console.log('initializeTokenExIframe');
    const iframe = await doInitializeTokenExIframe({
      ...args,
      tokenExScriptLoaded: true,
      env,
      setCachedToken: this.setCachedToken.bind(this),
      setLoaded: this.setLoaded.bind(this),
    });
    console.log('iframe', iframe);
    this.setTokenExIframe(iframe);
    if (iframe) iframe.load();
    console.log('LOADED');
    return iframe;
  }

  async initializeTokenExCardOnlyIframe(
    env: CoinflowEnvs,
    args: Omit<
      Parameters<typeof doInitializeTokenExCardOnlyIframe>[0],
      'env' | 'tokenExScriptLoaded' | 'setCachedToken' | 'setLoaded'
    >
  ) {
    const iframe = await doInitializeTokenExCardOnlyIframe({
      ...args,
      tokenExScriptLoaded: true,
      env,
      setCachedToken: this.setCachedToken.bind(this),
      setLoaded: this.setLoaded.bind(this),
    });
    this.setTokenExIframe(iframe);
    if (iframe) iframe.load();
    return iframe;
  }
}
