import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../stores';

@Component({
  selector: 'co19-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  isCovidDataLoaded$ = this.store.select(fromRoot.isLoaded);
  totalDeaths$ = this.store.select(fromRoot.totalDeaths);
  totalConfirmed$ = this.store.select(fromRoot.totalConfirmed);
  totalRecovered$ = this.store.select(fromRoot.totalRecovered);
  latestData$ = this.store.select(fromRoot.selectLatestDataWithCountryInfo);

  constructor(private store: Store) {}

  ngOnInit() {}
}
