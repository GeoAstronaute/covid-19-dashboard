import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'co19-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'covid-dashboard';
}
