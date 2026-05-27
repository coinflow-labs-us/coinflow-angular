import {Component, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  CardFormArgs,
  CoinflowCardForm,
} from '../../../../coinflowlabs/src/lib/card-form/coinflow-card-form-v2.component';

@Component({
  selector: 'card-form-v2-test-bench',
  standalone: true,
  imports: [CoinflowCardForm, CommonModule],
  template: `
    <div [style.margin]="'40px auto'" [style.width]="'fit-content'">
      <h3>CoinflowCardFormV2 (card-form)</h3>
      <p [style.fontSize]="'12px'" [style.color]="'#666'">
        Drag the bottom-right corner to resize. Below ~372px it should collapse
        to two rows.
      </p>
      <div
        [style.width]="'420px'"
        [style.minWidth]="'240px'"
        [style.maxWidth]="'600px'"
        [style.resize]="'horizontal'"
        [style.overflow]="'auto'"
        [style.padding]="'8px'"
        [style.border]="'1px dashed #ccc'"
      >
        <lib-coinflow-card-form #child [args]="args"></lib-coinflow-card-form>
      </div>
      <button (click)="onClick()">Tokenize</button>
      <p *ngIf="token">Token: {{ token }}</p>
      <p *ngIf="error" [style.color]="'red'">Error: {{ error }}</p>
    </div>
  `,
})
export class CardFormV2TestBenchComponent {
  @ViewChild('child') child!: CoinflowCardForm;
  token: string | null = null;
  error: string | null = null;

  args: CardFormArgs = {
    merchantId: 'paysafe',
    env: 'staging',
    variant: 'card-form',
  };

  onClick() {
    this.error = null;
    this.child
      .tokenize()
      .then(res => (this.token = JSON.stringify(res)))
      .catch(e => (this.error = (e as Error).message));
  }
}
