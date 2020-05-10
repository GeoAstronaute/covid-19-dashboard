import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country } from '../models/country.service';


@Injectable({providedIn: 'root'})
export class CountryService {
  constructor(private http: HttpClient) {}

  loadCountries(): Observable<Country[]> {
    return this.http.get<Country[]>('https://restcountries.eu/rest/v2/all');
  }
}
