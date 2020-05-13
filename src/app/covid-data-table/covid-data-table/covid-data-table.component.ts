import { Component, OnInit, ChangeDetectionStrategy, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../stores';
import { selectCountry } from 'src/app/stores/country/country.actions';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { filter, withLatestFrom, map, takeUntil } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';

@Component({
  selector: 'co19-covid-data-table',
  templateUrl: './covid-data-table.component.html',
  styleUrls: ['./covid-data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CovidDataTableComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport) scrollViewport: CdkVirtualScrollViewport;
  sorting$ = new BehaviorSubject<Sort>({active: 'countryOrRegion', direction: 'asc'});
  latestData$ = combineLatest([this.store.select(fromRoot.selectLatestDataWithCountryInfo), this.sorting$.asObservable()])
    .pipe(
      map(([latestData, sorting]) =>
        sorting?.active && sorting?.direction !== '' ?
        [...latestData].sort((a, b) => this.compare(a[sorting.active], b[sorting.active], sorting.direction === 'asc'))
        : latestData
      )
    );
  selectedCountryId$ = this.store.select(fromRoot.getSelectedCountryId);
  latestDataWithSelection$ = combineLatest([this.latestData$, this.selectedCountryId$]).pipe(
    map(([latestData, selectedCountryId]) => latestData.map(d =>
      ({...d, selected: selectedCountryId && selectedCountryId === d.alpha2Code})
    ))
  );
  componentDestroyed$ = new Subject<void>();

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.selectedCountryId$.pipe(
      filter(id => !!id),
      withLatestFrom(this.latestData$),
      takeUntil(this.componentDestroyed$)
    ).subscribe(([id, data]) => {
      const index = data.findIndex(d => d.alpha2Code === id);
      if (index) {
        this.scrollViewport.scrollToIndex(index);
      }
    });
  }

  selectCountry(id: string) {
    this.store.dispatch(selectCountry({selected: id}));
  }

  sortData(event: Sort) {
    this.sorting$.next(event);
  }

  trackByUid(index, item) {
    return item.uid;
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

}
