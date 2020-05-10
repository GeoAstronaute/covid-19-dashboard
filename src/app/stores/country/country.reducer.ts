import {
  createReducer,
  Action,
  on
} from '@ngrx/store';
import { Country } from '../../models/country.service';
import { loadCountriesSuccess, selectCountry } from './country.actions';

export interface CountryState {
  inited: boolean;
  selected?: string;
  entities?: Country[];
}

export const initialState: CountryState = {
  inited: false
};

export const countryReducer = createReducer(
  initialState,
  on(loadCountriesSuccess, (state, {countries}) => ({
    ...state,
    inited: true,
    entities: countries
  })),
  on(selectCountry, (state, {selected}) => ({
    ...state,
    selected
  }))
);

export function reducer(state: CountryState | undefined, action: Action) {
  return countryReducer(state, action);
}
