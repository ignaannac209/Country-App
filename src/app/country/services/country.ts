import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries';
import {
  catchError,
  EMPTY,
  expand,
  map,
  Observable,
  of,
  reduce,
  tap,
  throwError,
  timeout,
} from 'rxjs';
import { CountryMapper } from '../mappers/country';
import type { Country as CountryModel } from '../interfaces/country.interface';
import type { CountryItem } from '../interfaces/rest-countries';
import { Region } from '../interfaces/region.type';

const API_URL = '/api/countries/v5';

@Service()
export class Country {
  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, CountryModel[]>();
  private queryCacheCountry = new Map<string, CountryModel[]>();
  private queryCacheRegion = new Map<Region, CountryModel[]>();

  searchByCapital(query: string): Observable<CountryModel[]> {
    const searchTerm = query.trim();
    const normalizedQuery = searchTerm.toLocaleLowerCase();

    if (this.queryCacheCapital.has(normalizedQuery)) {
      return of(this.queryCacheCapital.get(normalizedQuery)!);
    }

    return this.http
      .get<RESTCountry>(`${API_URL}?q=${encodeURIComponent(searchTerm)}`)
      .pipe(
      map(CountryMapper.mapApiResponseToCountryArray),
      map(countries => {
        const matches = countries.filter(country =>
          country.capitals
              .split(', ')
              .some(capital => capital.toLocaleLowerCase().includes(normalizedQuery))
          );

          if (matches.length === 0) {
            throw new Error(`No se encontraron países para la capital: ${searchTerm}`);
          }

          return matches;
        }),
        tap(matches => {
          this.queryCacheCapital.set(normalizedQuery, matches);
        }),
        catchError(error => {
          console.error('Error al buscar países por capital:', error);
          return throwError(
            () =>
              new Error(
                `No se pudieron cargar los países por capital: ${searchTerm}...\nIntenta de nuevo.`
              )
          );
        })
      );
  }

  searchByCountry(query: string): Observable<CountryModel[]> {
    const searchTerm = query.trim();
    if (!searchTerm) return of([]);

    const normalizedQuery = searchTerm.toLocaleLowerCase();

    if (this.queryCacheCountry.has(normalizedQuery)) {
      return of(this.queryCacheCountry.get(normalizedQuery)!);
    }

    return this.http
      .get<RESTCountry>(`${API_URL}?q=${encodeURIComponent(searchTerm)}`)
      .pipe(
        timeout({ first: 10000 }),
        catchError(error => {
          console.error('Error al buscar países:', error);
          return throwError(
            () => new Error('No se pudo completar la búsqueda. Intenta de nuevo.')
          );
        }),
        map(CountryMapper.mapApiResponseToCountryArray),
        map(countries => {
          const matches = countries.filter(country =>
            country.names.toLocaleLowerCase().includes(normalizedQuery)
          );

          if (matches.length === 0) {
            throw new Error('No se encontraron países con ese nombre. Intenta de nuevo.');
          }

          return matches;
        }),
        tap(matches => {
          this.queryCacheCountry.set(normalizedQuery, matches);
        })
      );
  }

  searchByRegion(region: Region): Observable<CountryModel[]> {
    if (this.queryCacheRegion.has(region)) {
      return of(this.queryCacheRegion.get(region)!);
    }

    return this.http
      .get<RESTCountry>(`${API_URL}?region=${encodeURIComponent(region)}`)
      .pipe(
        expand(response =>
          response.data.meta.more
            ? this.http.get<RESTCountry>(
                `${API_URL}?region=${encodeURIComponent(region)}&offset=${
                  response.data.meta.offset + response.data.meta.limit
                }`
              )
            : EMPTY
        ),
        reduce(
          (countryItems, response) => countryItems.concat(response.data.objects),
          [] as CountryItem[]
        ),
        map(CountryMapper.mapCountryItemArrayToCountryArray),
        tap(countries => {
          this.queryCacheRegion.set(region, countries);
        }),
        catchError(error => {
          console.error(`Error al buscar países de la región ${region}:`, error);
          return throwError(
            () => new Error(`No se pudieron cargar los países de la región ${region}`)
          );
        })
      );
  }

  searchCountryByAlphaCode(code: string): Observable<CountryModel> {
    const countryCode = code?.trim().toLocaleUpperCase();

    if (!countryCode) {
      return throwError(() => new Error('Se requiere un código de país para la búsqueda'));
    }

    return this.http
      .get<RESTCountry>(`${API_URL}?q=${encodeURIComponent(countryCode)}`)
      .pipe(
        map(CountryMapper.mapApiResponseToCountryArray),
        map(countries => {
          const country = countries.find(
            country => country.alpha_2.toLocaleUpperCase() === countryCode
          );

          if (!country) {
            throw new Error(`No se encontró un país con el código ${countryCode}`);
          }

          return country;
        }),
        catchError(error => {
          console.error('Error al buscar país por código:', error);
          return throwError(
            () => new Error(`No se pudo obtener el país con ese código ${countryCode}`)
          );
        })
      );
  }
}
