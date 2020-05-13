import { Component, ViewChild, ChangeDetectionStrategy, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { WebmapComponent } from 'src/app/webmap/webmap/webmap.component';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../stores';
import { filter, take, takeUntil } from 'rxjs/operators';
import { CovidWebmapLayerService } from 'src/app/services/covid-webmap-layer.service';
import { WebmapUtilsService } from 'src/app/services/webmap-utils.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { selectCountry } from 'src/app/stores/country/country.actions';
import { MatButtonToggleGroup, MatButtonToggleChange } from '@angular/material/button-toggle';

@Component({
  selector: 'co19-covid-webmap',
  templateUrl: './covid-webmap.component.html',
  styleUrls: ['./covid-webmap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CovidWebmapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(WebmapComponent) webmap: WebmapComponent;
  @ViewChild(MatButtonToggleGroup) symbologyToggle: MatButtonToggleGroup;
  countryLayer: __esri.FeatureLayer;
  isCovidDataLoaded$ = this.store.select(fromRoot.isLoaded);
  latestData$ = this.store.select(fromRoot.selectLatestDataWithCountryInfo);
  selectedCountry$ = this.store.select(fromRoot.getSelectedCountry);
  countryLayerView: __esri.FeatureLayerView;
  highlight: __esri.Handle;
  clickedCountry$ = new BehaviorSubject<__esri.Graphic>(null);
  componentDestroyed$ = new Subject<void>();
  symbologies = {
    deaths: {
      inversed: true
    },
    recovered: {
      inversed: false
    },
    confirmed: {
      inversed: true
    },
    deathsPercentage: {
      valueExpression: '($feature.deaths / $feature.confirmed) * 100',
      inversed: true
    },
    recoveredPercentage: {
      valueExpression: '($feature.recovered / $feature.confirmed) * 100',
      inversed: false
    }
  };

  constructor(
    private store: Store,
    private covidWebmapLayerService: CovidWebmapLayerService,
    private webmapUtils: WebmapUtilsService
  ) {}

  ngOnInit() {
    this.selectedCountry$.pipe(
      filter(country => !!country),
      takeUntil(this.componentDestroyed$)
    )
    .subscribe(async (country) => {
      this.highlightCountry(country.alpha2Code);
      this.centerWebmap([country.latlng[1], country.latlng[0]]);
    });
  }

  ngAfterViewInit() {
    this.symbologyToggle.change
    .pipe(takeUntil(this.componentDestroyed$))
    .subscribe((change: MatButtonToggleChange) => {
      const valueExpression = this.symbologies[change.value].valueExpression;
      const inversed = this.symbologies[change.value].inversed;
      valueExpression ? this.covidWebmapLayerService.setRendererByValueExpression(change.value, valueExpression, this.webmap.view, inversed)
      : this.covidWebmapLayerService.setRenderer(change.value, inversed);
    });
  }

  async highlightCountry(id: string) {
    if (this.countryLayer) {
      const query = this.countryLayer.createQuery();
      query.where = `iso2 = '${id}'`;
      const result = await this.countryLayer.queryFeatures(query);
      if (this.highlight) {
        this.highlight.remove();
      }
      this.highlight = this.countryLayerView.highlight(result.features);
    }
  }

  centerWebmap(center: [number, number]) {
    this.webmap.view.goTo({
      center
    }, {duration: 600}).catch(err => ({}));
  }

  async initializeLayer() {
    const latestData = await this.latestData$.pipe(filter(d => d?.length > 0), take(1)).toPromise();
    this.countryLayer = await this.covidWebmapLayerService.buildLayer(latestData);
    this.webmap.map.add(this.countryLayer);
    this.updateLayerView();
  }

  async updateLayerView() {
    this.countryLayerView = await this.webmap.view.whenLayerView(this.countryLayer);
    this.clickedCountry$ = this.webmapUtils.registerClickEventOnLayer(this.countryLayerView, this.webmap.view);
    this.clickedCountry$.subscribe(graphic => {
      if (graphic) {
        this.store.dispatch(selectCountry({selected: graphic.attributes.iso2}));
      }
    });
    const selectedCountry = await this.selectedCountry$.pipe(take(1)).toPromise();
    if (selectedCountry) {
      this.highlightCountry(selectedCountry.alpha2Code);
    }
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
