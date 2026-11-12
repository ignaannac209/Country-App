import { Component, inject, linkedSignal, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchInput } from '../../components/search-input/search-input';
import { CountryList } from '../../components/country-list/country-list';
import { Country } from '../../services/country';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-by-country-page',
  imports: [SearchInput, CountryList],
  templateUrl: './by-country-page.html',
})
export class ByCountryPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly countryService = inject(Country);
  private readonly routeQuery = toSignal(
    this.route.queryParamMap.pipe(map(params => params.get('q') ?? '')),
    { initialValue: this.route.snapshot.queryParamMap.get('q') ?? '' }
  );
  readonly query = linkedSignal(() => this.routeQuery());
  readonly searchError = signal<string | null>(null);

  readonly countryResources = rxResource({
    params: () => ({ query: this.query() }),
    stream: ({ params }) => {
      this.searchError.set(null);
      if (!params.query) return of([]);

      return this.countryService.searchByCountry(params.query).pipe(
        catchError(error => {
          this.searchError.set(
            error instanceof Error
              ? error.message
              : 'No se pudo completar la búsqueda. Intenta de nuevo.'
          );
          return of([]);
        })
      );
    },
  });

  search(query: string): void {
    const searchTerm = query.trim();
    this.query.set(searchTerm);

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: searchTerm || null },
      queryParamsHandling: 'merge',
    });
  }
}
