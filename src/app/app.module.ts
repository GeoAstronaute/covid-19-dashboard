import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GlobalEffects } from './stores/covid-data/covid-data.effects';
import { environment } from '../environments/environment';
import { covidReducer } from './stores/covid-data/covid-data.reducer';
import { countryReducer } from './stores/country/country.reducer';
import { CountryEffects } from './stores/country/country.effects';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { CovidDataTableModule } from './covid-data-table/covid-data-table.module';
import { CovidRecapDataModule } from './covid-recap-data/covid-recap-data.module';
import { WebmapModule } from './webmap/webmap.module';
import { CovidWebmapModule } from './covid-webmap/covid-webmap.module';
registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatCardModule,
    FlexLayoutModule,
    CovidDataTableModule,
    CovidRecapDataModule,
    WebmapModule,
    CovidWebmapModule,
    StoreModule.forRoot({
      covidData: covidReducer,
      countries: countryReducer
    }, {}),
    EffectsModule.forRoot([GlobalEffects, CountryEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
