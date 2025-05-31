import {Component} from '@angular/core';
import {CoinflowPurchaseComponent} from '../../../../coinflowlabs/src/lib/coinflow-purchase.component';
import {
  CoinflowPurchaseProps,
  CoinflowWithdrawProps,
} from '../../../../coinflowlabs/src/lib/common';
import {
  Connection,
  Keypair,
  Transaction,
  VersionedTransaction,
} from '@solana/web3.js';
import {sign} from 'tweetnacl';
import {CoinflowWithdrawComponent} from '../../../../coinflowlabs/src/lib/coinflow-withdraw.component';

@Component({
  selector: 'app-test-bench',
  standalone: true,
  imports: [CoinflowPurchaseComponent, CoinflowWithdrawComponent],
  template: `
    <div [style.height]="purchaseHeight + 'px'">
      <lib-coinflow-purchase
        [purchaseProps]="purchaseProps"
      ></lib-coinflow-purchase>
    </div>
    <div [style.height]="withdrawHeight + 'px'">
      <lib-coinflow-withdraw
        [withdrawProps]="withdrawProps"
      ></lib-coinflow-withdraw>
    </div>
  `,
})
export class TestBenchComponent {
  purchaseHeight: string = '500';
  withdrawHeight: string = '500';

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

  purchaseProps: CoinflowPurchaseProps = {
    handleHeightChange: (height: string) => {
      this.purchaseHeight = height;
    },
    env: 'staging',
    subtotal: {cents: 100},
    blockchain: 'solana',
    merchantId: 'paysafe',
    connection: new Connection('https://api.devnet.solana.com'),
    wallet: this.wallet,
  };

  withdrawProps: CoinflowWithdrawProps = {
    handleHeightChange: (height: string) => {
      this.withdrawHeight = height;
    },
    env: 'staging',
    blockchain: 'solana',
    merchantId: 'paysafe',
    connection: new Connection('https://api.devnet.solana.com'),
    wallet: this.wallet,
  };
}
