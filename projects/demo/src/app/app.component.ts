import {Component} from '@angular/core';
import {TestBenchComponent} from './test-bench/test-bench.component';
import {CardFormTestBenchComponent} from './test-bench/card-form-test-bench.component';
import {SavedCardFormTestBenchComponent} from './test-bench/saved-card-form-test-bench.component';
import {CardNumberOnlyTestBenchComponent} from './test-bench/card-number-only-test-bench.component';
import {MobileWalletsTestBenchComponent} from './test-bench/mobile-wallets-test-bench.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TestBenchComponent,
    CardFormTestBenchComponent,
    SavedCardFormTestBenchComponent,
    CardNumberOnlyTestBenchComponent,
    MobileWalletsTestBenchComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'demo';
}
