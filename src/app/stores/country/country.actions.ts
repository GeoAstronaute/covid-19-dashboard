import { createAction, props } from '@ngrx/store';
import { Country } from 'src/app/models/country.service';

export const loadCountries = createAction('[Api/Countries] Load data');
export const loadCountriesSuccess = createAction(
  '[Api/Countries] Load data success',
  props<{ countries: Country[] }>()
);
export const loadCountriesFail = createAction(
  '[Api/Countries] Load data fail',
  props<{ error: any }>()
);
