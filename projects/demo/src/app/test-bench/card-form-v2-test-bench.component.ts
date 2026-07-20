import {Component, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  CardFormArgs,
  CoinflowCardForm,
} from '../../../../coinflowlabs/src/lib/card-form/coinflow-card-form-v2.component';
import {CardFormVariant} from '../../../../coinflowlabs/src/lib/common';

@Component({
  selector: 'card-form-v2-test-bench',
  standalone: true,
  imports: [CoinflowCardForm, CommonModule],
  template: `
    <div [style.margin]="'40px auto'" [style.width]="'fit-content'">
      <h3>CoinflowCardFormV2</h3>
      <p [style.fontSize]="'12px'" [style.color]="'#666'" [style.maxWidth]="'440px'">
        Drag the bottom-right corner to resize, then click <b>Reload iframe</b>
        to replay the skeleton at the current width. Variants with a compact
        layout collapse to two rows below their breakpoint.
      </p>

      <div [style.display]="'flex'" [style.gap]="'8px'" [style.marginBottom]="'8px'">
        <label>
          Variant:
          <select #sel (change)="setVariant($any(sel.value))">
            <option value="card-form">card-form</option>
            <option value="card-number-form">card-number-form</option>
            <option value="cvv-form">cvv-form</option>
          </select>
        </label>
        <button (click)="reload()">Reload iframe</button>
      </div>

      <div
        [style.width]="'420px'"
        [style.minWidth]="'240px'"
        [style.maxWidth]="'600px'"
        [style.resize]="'horizontal'"
        [style.overflow]="'auto'"
        [style.padding]="'8px'"
        [style.border]="'1px dashed #ccc'"
      >
        @for (key of [reloadKey]; track key) {
        <lib-coinflow-card-form #child [args]="args"></lib-coinflow-card-form>
        }
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

  // Bumping the key re-mounts the component via @for's track, which resets its
  // internal `loaded` state so the real skeleton shows again — synchronously,
  // within this click's change detection, and without a full page reload, so
  // the resized container width is preserved.
  reloadKey = 0;

  args: CardFormArgs = {
    merchantId: 'paysafe',
    env: 'local',
    variant: 'card-form',
  };

  reload() {
    this.token = null;
    this.error = null;
    this.reloadKey++;
  }

  setVariant(variant: CardFormVariant) {
    this.args = {...this.args, variant};
    this.reload();
  }

  onClick() {
    this.error = null;
    this.child
      .tokenize()
      .then(res => (this.token = JSON.stringify(res)))
      .catch(e => (this.error = (e as Error).message));
  }
}
