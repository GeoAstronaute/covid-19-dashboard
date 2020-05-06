import {
  createReducer,
  Action,
  on
} from '@ngrx/store';
import {
  loadLatestDataSuccess,
  loadTimeSerieDataSuccess
} from './covid-data.actions';
import { CovidLatestData, CovidTimeSerieData, CSSECountryData } from '../../models/covid-data.model';

export interface CovidState {
  inited: boolean;
  updating: boolean;
  lastFetch: Date;
  lookupTable?: CSSECountryData[];
  latestData?: CovidLatestData[];
  timeSerieData?: CovidTimeSerieData[];
}

export const initialState: CovidState = {
  inited: false,
  updating: false,
  lastFetch: null
};

export const covidReducer = createReducer(
  initialState,
  on(loadLatestDataSuccess, (state, {latestData}) => ({
    ...state,
    inited: true,
    lastFetch: new Date(),
    latestData
  })),
  on(loadTimeSerieDataSuccess, (state, {lookupTable, timeSerieData}) => ({
    ...state,
    lastFetch: new Date(),
    lookupTable,
    timeSerieData
  }))
);

export function reducer(state: CovidState | undefined, action: Action) {
  return covidReducer(state, action);
}
