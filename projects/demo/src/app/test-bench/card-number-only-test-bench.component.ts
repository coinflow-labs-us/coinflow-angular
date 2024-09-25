import {Component, ViewChild} from '@angular/core';
import {CoinflowCardNumberInputProps} from '../../../../coinflowlabs/src/lib/common';
import {CoinflowCardNumberInput} from '../../../../coinflowlabs/src/lib/card-form/coinflow-card-number-input.component';
import {CoinflowCvvInputComponent} from '../../../../coinflowlabs/src/lib/card-form/coinflow-cvv-input.component';
import {CoinflowCardNumberOnlyInput} from '../../../../coinflowlabs/src/lib/card-form/coinflow-card-number-only-input.component';

@Component({
  selector: 'card-number-only-test-bench',
  standalone: true,
  imports: [CoinflowCardNumberOnlyInput],
  template: `
    <div>
      <div [style.height]="40 + 'px'">
        <lib-coinflow-card-number-only-input
          #child
          [args]="cardNumberInputProps"
        ></lib-coinflow-card-number-only-input>
      </div>
      <button (click)="onClick()">Tokenize</button>
    </div>
  `,
})
export class CardNumberOnlyTestBenchComponent {
  @ViewChild('child') child!: CoinflowCardNumberInput;

  cardNumberInputProps: CoinflowCardNumberInputProps = {
    env: 'staging',
    debug: true,
    font: 'Calligraffitti',
    css: {
      base: 'font-family: Montserrat, sans-serif;padding: 0 8px;border: 0px;margin: 0;width: 100%;font-size: 13px;line-height: 48px;height: 48px;box-sizing: border-box;-moz-box-sizing: border-box;',
      focus: 'outline: 0;',
      error:
        'box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5);border: 1px solid rgba(224, 57, 57, 0.5);',
      cvv: {
        base: 'font-family: Montserrat, sans-serif;padding: 0 8px;border: 0px;margin: 0;width: 100%;font-size: 13px;line-height: 48px;height: 48px;box-sizing: border-box;-moz-box-sizing: border-box;',
        focus: 'outline: 0;',
        error:
          'box-shadow: 0 0 6px 0 rgba(224, 57, 57, 0.5);border: 1px solid rgba(224, 57, 57, 0.5);',
      },
    },
  };

  onClick() {
    console.log('onClick');
    this.child.tokenize().then(res => console.log(res));
  }
}
