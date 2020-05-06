import {
  createEffect,
  Actions,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { Injectable } from '@angular/core';
import {
  loadTimeSerieDataSuccess,
  loadTimeSerieDataFail,
  loadLatestDataSuccess,
  loadLatestDataFail,
} from './covid-data.actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { CovidDataService } from '../../services/covid-data.service';
import { of, from } from 'rxjs';

@Injectable()
export class GlobalEffects {
  constructor(
    private actions$: Actions,
    private covidApiService: CovidDataService
  ) {}

  loadLatestData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMap(() =>
        from(this.covidApiService.loadLatestDataByCountry()).pipe(
          map((latestData) => loadLatestDataSuccess({ latestData })),
          catchError((error) => of(loadLatestDataFail({ error })))
        )
      )
    )
  );

  loadTimeSerieData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMap(() =>
        this.covidApiService.loadTimeSerieData().pipe(
          map((result) => loadTimeSerieDataSuccess(result)),
          catchError((error) => of(loadTimeSerieDataFail({ error })))
        )
      )
    )
  );
}
