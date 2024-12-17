import {Component, ViewChild} from '@angular/core';
import {CoinflowCardNumberInputProps} from '../../../../coinflowlabs/src/lib/common';
import {CoinflowCardNumberInput} from '../../../../coinflowlabs/src/lib/card-form/coinflow-card-number-input.component';
import {CoinflowCvvInputComponent} from '../../../../coinflowlabs/src/lib/card-form/coinflow-cvv-input.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'card-form-test-bench',
  standalone: true,
  imports: [CoinflowCardNumberInput, CoinflowCvvInputComponent, CommonModule],
  template: `
    <div>
      <div *ngIf="visible">
        <div [style.height]="40 + 'px'">
          <lib-coinflow-card-number-input
            #child
            [args]="cardNumberInputProps"
          ></lib-coinflow-card-number-input>
        </div>
        <div [style.height]="40 + 'px'">
          <lib-coinflow-cvv-input></lib-coinflow-cvv-input>
        </div>
        <button (click)="onClick()">Tokenize</button>
      </div>
      <button (click)="changeVisible()">Show</button>
      <button (click)="reinitialize()">Reinitialize</button>
    </div>
  `,
})
export class CardFormTestBenchComponent {
  @ViewChild('child') child!: CoinflowCardNumberInput;
  visible = true;

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

  reinitialize() {
    this.child.reinitialize();
  }

  // Optional: Test ngIf functionality
  changeVisible() {
    this.visible = !this.visible;
  }
}
