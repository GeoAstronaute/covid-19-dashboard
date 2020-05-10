import {
  createReducer,
  Action,
  on
} from '@ngrx/store';
import { Country } from '../../models/country.service';
import { loadCountriesSuccess } from './country.actions';

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
);

export function reducer(state: CountryState | undefined, action: Action) {
  return countryReducer(state, action);
}
