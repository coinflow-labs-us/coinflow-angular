import {Component, ViewChild} from '@angular/core';
import {
  CoinflowCvvOnlyInputProps,
  CardType,
} from '../../../../coinflowlabs/src/lib/common';
import {CommonModule} from '@angular/common';
import {CoinflowCardNumberInput} from '../../../../coinflowlabs/src/lib/card-form/coinflow-card-number-input.component';
import {CoinflowCvvOnlyInputComponent} from '../../../../coinflowlabs/src/lib/card-form/coinflow-cvv-only-input.component';

@Component({
  selector: 'saved-card-form-test-bench',
  standalone: true,
  imports: [CoinflowCvvOnlyInputComponent, CommonModule],
  template: `
    <div>
      <ng-container *ngIf="visible">
        <div [style.height]="40 + 'px'">
          <lib-coinflow-cvv-only-input
            #child
            [args]="cardNumberInputProps"
          ></lib-coinflow-cvv-only-input>
        </div>
      </ng-container>
      <button (click)="onClick()">Tokenize</button>
      <button (click)="changeVisible()">Change Visibility</button>
    </div>
  `,
})
export class SavedCardFormTestBenchComponent {
  @ViewChild('child') child!: CoinflowCardNumberInput;
  visible = true;

  cardNumberInputProps: CoinflowCvvOnlyInputProps = {
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
    token: '4000057YPB4M5556',
    cardType: CardType.VISA,
  };

  onClick() {
    console.log('onClick');
    this.child.tokenize().then(res => console.log(res));
  }

  changeVisible() {
    this.visible = !this.visible;
  }
}
