import {Component} from '@angular/core';
import {TokenExCvvContainerID} from '../common';

@Component({
  selector: 'lib-coinflow-cvv-input',
  standalone: true,
  imports: [],
  template: '<div id="{{TokenExCvvContainerID}}" ></div>',
})
export class CoinflowCvvInputComponent {
  protected readonly TokenExCvvContainerID = TokenExCvvContainerID;
}
