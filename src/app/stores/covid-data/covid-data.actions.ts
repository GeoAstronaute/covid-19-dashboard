import { createAction, props } from '@ngrx/store';
import { CSSECountryData, CovidTimeSerieData, CovidLatestData } from '../../models/covid-data.model';

export const loadTimeSerieData = createAction('[Api/Covid] Load time serie data');
export const loadTimeSerieDataSuccess =
  createAction('[Api/Covid] Load time serie data success', props<{lookupTable: CSSECountryData[], timeSerieData: CovidTimeSerieData[]}>());
export const loadTimeSerieDataFail = createAction('[Api/Covid] Load time serie data fail', props<{error: any}>());

export const loadLatestData = createAction('[Api/Covid] Load latest data');
export const loadLatestDataSuccess =
  createAction('[Api/Covid] Load latest data success', props<{latestData: CovidLatestData[]}>());
export const loadLatestDataFail = createAction('[Api/Covid] Load latest data fail', props<{error: any}>());
