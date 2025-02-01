import {Component} from '@angular/core';
import {CoinflowPurchaseProps} from '../../../../coinflowlabs/src/lib/common';
import {
  Connection,
  Keypair,
  Transaction,
  VersionedTransaction,
} from '@solana/web3.js';
import {sign} from 'tweetnacl';
import {CoinflowApplePayButtonComponent} from '../../../../coinflowlabs/src/lib/mobile-wallet/coinflow-apple-pay-button.component';
import {CoinflowGooglePayButtonComponent} from '../../../../coinflowlabs/src/lib/mobile-wallet/coinflow-google-pay-button.component';

@Component({
  selector: 'mobile-wallets-test-bench',
  standalone: true,
  imports: [CoinflowApplePayButtonComponent, CoinflowGooglePayButtonComponent],
  template: `
    <div
      style="height: 100vh; width: 300px; background-color: #0f172a; padding-left: 40px; padding-right: 40px"
    >
      <div style="height: 40px"></div>
      <div
        [style.height]="40 + 'px'"
        style="border-radius: 12px;  overflow: hidden"
      >
        <lib-coinflow-google-pay-button
          [purchaseProps]="purchaseProps"
        ></lib-coinflow-google-pay-button>
      </div>
      <div style="height: 40px"></div>
      <div
        [style.height]="height + 'px'"
        style="border-radius: 12px; overflow: hidden"
      >
        <lib-coinflow-apple-pay-button
          [purchaseProps]="purchaseProps"
        ></lib-coinflow-apple-pay-button>
      </div>
    </div>
  `,
})
export class MobileWalletsTestBenchComponent {
  height: string = '40';

  // HHxJEwJY7NDgrHpnBkX3DTmhG5mMnvGFsp631s1sptRQ
  keypair = Keypair.fromSecretKey(
    Uint8Array.from([
      56, 14, 246, 208, 184, 212, 110, 37, 164, 242, 149, 110, 238, 115, 65,
      243, 91, 159, 62, 192, 243, 4, 84, 48, 19, 210, 63, 37, 208, 36, 158, 61,
      242, 18, 206, 253, 243, 8, 213, 146, 146, 126, 125, 217, 207, 28, 77, 218,
      206, 8, 210, 3, 70, 26, 82, 213, 209, 139, 197, 120, 5, 103, 102, 171,
    ])
  );

  wallet = {
    publicKey: this.keypair.publicKey,
    sendTransaction: (tx: Transaction | VersionedTransaction) => {
      const connection = new Connection('https://api.devnet.solana.com');
      if (tx instanceof Transaction) {
        tx.sign(this.keypair);
      } else {
        tx.sign([this.keypair]);
      }
      return connection.sendRawTransaction(tx.serialize());
    },
    signMessage: (message: Uint8Array) => {
      // console.log(Buffer.from(message).toString());
      return Promise.resolve(sign.detached(message, this.keypair.secretKey));
    },
  };

  purchaseProps: CoinflowPurchaseProps & {
    color: 'black' | 'white';
    onError?: (message: string) => void;
  } = {
    handleHeightChange: (height: string) => {
      this.height = height;
    },
    env: 'local',
    subtotal: {cents: 100},
    blockchain: 'solana',
    merchantId: 'paysafe',
    connection: new Connection('https://api.devnet.solana.com'),
    wallet: this.wallet,
    color: 'white',
    theme: {
      background: '#0f172a',
    },
    onError: (message: string) => {
      console.log(`ANGULAR on error ${message}`);
    },
  };
}
