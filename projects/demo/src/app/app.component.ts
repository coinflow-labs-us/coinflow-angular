import {Component} from '@angular/core';
import {TestBenchComponent} from './test-bench/test-bench.component';
import {CardFormV2TestBenchComponent} from './test-bench/card-form-v2-test-bench.component';
import {MobileWalletsTestBenchComponent} from './test-bench/mobile-wallets-test-bench.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TestBenchComponent,
    CardFormV2TestBenchComponent,
    MobileWalletsTestBenchComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'demo';
}
