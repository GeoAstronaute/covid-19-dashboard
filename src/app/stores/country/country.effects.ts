import {
  createEffect,
  Actions,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CountryService } from 'src/app/services/country.service';
import { loadCountriesSuccess, loadCountriesFail } from './country.actions';

@Injectable()
export class  CountryEffects {
  constructor(
    private actions$: Actions,
    private countryService: CountryService
  ) {}

  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMap(() =>
        this.countryService.loadCountries().pipe(
          map((countries) => loadCountriesSuccess({ countries })),
          catchError((error) => of(loadCountriesFail({ error })))
        )
      )
    )
  );
}
