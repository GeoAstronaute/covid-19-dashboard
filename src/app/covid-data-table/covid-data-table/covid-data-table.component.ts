import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../stores';
import { selectCountry } from 'src/app/stores/country/country.actions';

@Component({
  selector: 'co19-covid-data-table',
  templateUrl: './covid-data-table.component.html',
  styleUrls: ['./covid-data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CovidDataTableComponent implements OnInit {
  latestData$ = this.store.select(fromRoot.selectLatestDataWithCountryInfo);

  constructor(private store: Store) { }

  ngOnInit(): void {}

  selectCountry(id: string) {
    this.store.dispatch(selectCountry({selected: id}));
  }

  trackByUid(index, item) {
    return item.uid;
  }

}
