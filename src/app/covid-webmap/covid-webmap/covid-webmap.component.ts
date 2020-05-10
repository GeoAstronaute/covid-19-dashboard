import { Component, ViewChild, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { WebmapComponent } from 'src/app/webmap/webmap/webmap.component';
import { loadModules } from 'esri-loader';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../stores';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'co19-covid-webmap',
  templateUrl: './covid-webmap.component.html',
  styleUrls: ['./covid-webmap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CovidWebmapComponent implements OnInit {
  @ViewChild(WebmapComponent) webmap: WebmapComponent;
  countryLayer: __esri.FeatureLayer;
  isCovidDataLoaded$ = this.store.select(fromRoot.isLoaded);
  latestData$ = this.store.select(fromRoot.selectLatestDataWithCountryInfo);
  selectedCountry$ = this.store.select(fromRoot.getSelectedCountry);
  countryLayerView: __esri.FeatureLayerView;
  highlight: __esri.Handle;

  constructor(private store: Store) {}

  ngOnInit() {
    this.selectedCountry$.pipe(filter(country => !!country))
    .subscribe(async (country) => {
      this.highlightCountry(country.alpha2Code);
      this.centerWebmap([country.latlng[1], country.latlng[0]]);
    });
  }

  async highlightCountry(id: string) {
    const query = this.countryLayer.createQuery();
    query.where = `iso2 = '${id}'`;
    const result = await this.countryLayer.queryFeatures(query);
    if (this.highlight) {
      this.highlight.remove();
    }
    this.highlight = this.countryLayerView.highlight(result.features);
  }

  centerWebmap(center: [number, number]) {
    this.webmap.view.goTo({
      center
    }, {duration: 140});
  }

  async initializeLayer() {
    const [FeatureLayer, ClassBreaksRenderer]: [__esri.FeatureLayerConstructor, any] = await loadModules([
      'esri/layers/FeatureLayer',
      'esri/renderers/ClassBreaksRenderer'
    ]);
    const countryLayer = new FeatureLayer({
      url:
        'https://services7.arcgis.com/bxmuD0WlNbMDdTJ6/arcgis/rest/services/world_countries/FeatureServer/0',
    });
    const query = countryLayer.createQuery();
    query.returnGeometry = true;
    query.geometryPrecision = 1;
    query.outFields = ['CNTR_ID as iso2, Name'];
    const result = await countryLayer.queryFeatures(query);
    this.latestData$.subscribe(async (data) => {
      const graphics = result.features.map((graphic) => {
        const covidData = data.find(
          (d) => d.alpha2Code === graphic.attributes.iso2
        );
        return {
          geometry: graphic.geometry,
          attributes: {
            ...graphic.attributes,
            ...covidData,
          }
        };
      });
      this.countryLayer = new FeatureLayer({
        source: graphics, // array of graphics objects
        title: 'Countries',
        objectIdField: 'OBJECTID',
        geometryType: 'polygon',
        opacity: 0.7,
        spatialReference: countryLayer.spatialReference,
        fields: [
          {
            name: 'OBJECTID',
            type: 'oid',
          },
          {
            name: 'iso2',
            type: 'string',
          },
          {
            name: 'Name',
            type: 'string',
          },
          {
            name: 'deaths',
            type: 'integer',
          },
          {
            name: 'recovered',
            type: 'integer',
          },
          {
            name: 'confirmed',
            type: 'integer',
          }
        ]
      });
      const popup = this.countryLayer.createPopupTemplate();
      this.countryLayer.popupTemplate = popup;
      const renderer = new ClassBreaksRenderer({
        // attribute of interest - Earthquake magnitude
        field: 'deaths',
        defaultSymbol: {
          type: 'simple-fill',
          color: 'gray'
        }
      });

      renderer.addClassBreakInfo({
        minValue: 0,
        maxValue: 0,
        symbol: {
          type: 'simple-fill',
          color: 'green'
        }
      });

      renderer.addClassBreakInfo({
        minValue: 1,
        maxValue: 1000,
        symbol: {
          type: 'simple-fill',
          color: 'orange'
        }
      });

      renderer.addClassBreakInfo({
        minValue: 1000,
        maxValue: 1000000,
        symbol: {
          type: 'simple-fill',
          color: 'red'
        }
      });
      this.countryLayer.renderer = renderer;
      this.webmap.map.add(this.countryLayer);
      this.countryLayerView = await this.webmap.view.whenLayerView(this.countryLayer);
    });
  }
}
