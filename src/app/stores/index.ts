import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  createReducer,
  Action,
  on
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { CovidState } from './covid-data/covid-data.reducer';
import { CovidLatestData } from '../models/covid-data.model';
import { CountryState } from './country/country.reducer';

export interface AppState {
  covidData: CovidState;
  countries: CountryState;
}

export const selectCovid = (state: AppState) => state.covidData;
export const selectCountryState = (state: AppState) => state.countries;
export const isLoaded = createSelector(
  selectCovid,
  (state: CovidState) => state.inited
);
export const selectLatestData = createSelector(
  selectCovid,
  (state: CovidState) => state.latestData
);
export const totalDeaths = createSelector(
  selectLatestData,
  (data: CovidLatestData[]) => {
    const totalReducer = (acc: number, val) => acc + val.deaths;
    return data.reduce(totalReducer, 0);
  }
);
export const totalRecovered = createSelector(
  selectLatestData,
  (data: CovidLatestData[]) => {
    const totalReducer = (acc: number, val) => acc + val.recovered;
    return data.reduce(totalReducer, 0);
  }
);
export const totalConfirmed = createSelector(
  selectLatestData,
  (data: CovidLatestData[]) => {
    const totalReducer = (acc: number, val) => acc + val.confirmed;
    return data.reduce(totalReducer, 0);
  }
);

export const selectAllCountries = createSelector(
  selectCountryState,
  (countryState) => countryState.entities
);

export const selectLatestDataWithCountryInfo = createSelector(
  selectLatestData,
  selectAllCountries,
  (covidLatestData, allCountries) => {
    if (covidLatestData?.length && allCountries?.length) {
      return covidLatestData.map((data) => {
        const correspondingCountry = allCountries.find(c => c.alpha3Code === data.iso3);
        const result = {
          ...data,
          ...correspondingCountry
        };
        return result;
      });
    }
    return null;
  }
);
