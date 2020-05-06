import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { loadModules } from 'esri-loader';

import { CovidLatestData, CSSECountryData, CovidTimeSerieData } from '../models/covid-data.model';

@Injectable({
  providedIn: 'root'
})
export class CovidDataService {
  constructor(private http: HttpClient) {}

  async loadLatestDataByCountry(): Promise<CovidLatestData[]> {
    const [FeatureLayer]: [__esri.FeatureLayerConstructor] = await loadModules(['esri/layers/FeatureLayer']);
    const CSSELatestDataLayer: __esri.FeatureLayer = new FeatureLayer({
      url: 'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases2_v1/FeatureServer/2'
    });
    const query = CSSELatestDataLayer.createQuery();
    query.returnGeometry = false;
    query.outFields = [
      'UID as uid',
      'Last_Update as lastUpdate',
      'Confirmed as confirmed',
      'Deaths as deaths',
      'Recovered as recovered',
      'Active as active',
      'ISO3 as iso3'
    ];
    const result = await CSSELatestDataLayer.queryFeatures(query);
    return result.features.map(feature => feature.attributes);
  }

  loadCSSELookupTable() {
    return this.fetchCSVData(
      'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/UID_ISO_FIPS_LookUp_Table.csv'
    ).pipe(
      map(response => this.buildLookupTable(response))
    );
  }

  loadTimeSerieRecoveredData(): Observable<string[][]> {
    return this.fetchCSVData(
      'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv'
    );
  }

  loadTimeSerieDeathsData(): Observable<string[][]> {
    return this.fetchCSVData(
      'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv'
    );
  }

  loadTimeSerieConfirmedData(): Observable<string[][]> {
    return this.fetchCSVData(
      'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'
    );
  }

  loadTimeSerieData(): Observable<{lookupTable: CSSECountryData[], timeSerieData: CovidTimeSerieData[]}> {
    return this.loadCSSELookupTable().pipe(
      switchMap((lookupTable) =>
        combineLatest([
          this.loadTimeSerieDeathsData(),
          this.loadTimeSerieConfirmedData(),
          this.loadTimeSerieConfirmedData()
        ]).pipe(
          map(([deathData, confirmedData, recoveredData]) => [
            this.buildTimeSerieFromCSVData(deathData, 'deaths', lookupTable),
            this.buildTimeSerieFromCSVData(confirmedData, 'confirmed', lookupTable),
            this.buildTimeSerieFromCSVData(recoveredData, 'recovered', lookupTable)
          ]),
          map(([deathData, confirmedData, recoveredData]) => this.mergeTimeSerieDatas(deathData, confirmedData, recoveredData)),
          map(timeSerieData => ({lookupTable, timeSerieData}))
        )
      )
    );
  }

  private fetchCSVData(url: string): Observable<string[][]> {
    return this.http.get(url, { responseType: 'text' }).pipe(
      map((responseText) => this.csvStringToArray(responseText))
    );
  }

  private csvStringToArray(strData): string[][] {
    const objPattern = new RegExp(('(\\,|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^\\,\\r\\n]*))'), 'gi');
    let arrMatches = null;
    const arrData = [[]];
    // tslint:disable-next-line: no-conditional-assignment
    while (arrMatches = objPattern.exec(strData)) {
        if (arrMatches[1].length && arrMatches[1] !== ',') {
          arrData.push([]);
        }
        arrData[arrData.length - 1].push(arrMatches[2] ?
            arrMatches[2].replace(new RegExp( '\"\"', 'g'), '\"') :
            arrMatches[3]);
    }
    return arrData;
}

  private buildTimeSerieFromCSVData(data: string[][], type: string, lookupTable: any[]): CovidTimeSerieData[] {
    // The first element correspond to the header
    const headers: string[] = data[0];
    const response = [];
    for (const line of data) {
      // Don't include the header in the data
      if (line !== headers) {
        const obj: any = { data: [] };
        headers.forEach((val, i) => {
          // Retrieve CSSE UID from combinedKey
          if (i === 0) {
            const combinedKey = line[0] ? `${line[0]}, ${line[1]}` : line[1];
            // Fix needed because of typos in data where space is missing in combined key
            const combinedKeyWithoutSpace = line[0] ? `${line[0]},${line[1]}` : line[1];
            obj.uid = lookupTable.find(d =>
              d.combinedKey === combinedKey || d.combinedKey === combinedKeyWithoutSpace
            )?.uid;
          }
          // Skip other properties as they can be retrieved with uid
          if (i > 3) {
            // Store the evolution of recovered/deaths or confirmed in an array
            const timeSerieData: any = {};
            timeSerieData.date = new Date(val);
            timeSerieData[type] = parseInt(line[i], 10);
            obj.data.push(timeSerieData);
          }
        });
        if (obj.uid) {
          response.push(obj);
        }
      }
    }
    return response;
  }

  private buildLookupTable(data: string[][]) {
    const originalHeaders = data[0];
    const normalizedHeader = [
      'uid',
      'iso2',
      'iso3',
      'code3',
      'fips',
      'admin2',
      'provinceOrState',
      'countryOrRegion',
      'latitude',
      'longitude',
      'combinedKey',
      'population'
    ];
    const result = [];
    for (const line of data) {
      if (line !== originalHeaders) {
        const countryData: any = {};
        normalizedHeader.forEach((header, index) => {
          countryData[header] = line[index];
        });
        countryData.uid = parseInt(countryData.uid, 10);
        countryData.population = parseInt(countryData.population, 10);
        countryData.latitude = parseInt(countryData.latitude, 10);
        countryData.longitude = parseInt(countryData.longitude, 10);
        result.push(countryData);
      }
    }
    return result;
  }

  mergeTimeSerieDatas(deaths, confirmed, recovered) {
    deaths.forEach((death) => {
      const recoveredData = recovered.find(r => r.uid === death.uid);
      const confirmedData = confirmed.find(r => r.uid === death.uid);
      death.data.forEach((timeData, i) => {
        timeData.recovered = recoveredData?.data ? recoveredData.data[i]?.recovered : undefined;
        timeData.confirmed = confirmedData?.data ? confirmedData.data[i]?.confirmed : undefined;
      });
    });
    return deaths;
  }
}
