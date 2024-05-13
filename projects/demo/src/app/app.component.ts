import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TestBenchComponent} from './test-bench/test-bench.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TestBenchComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'demo';
}
