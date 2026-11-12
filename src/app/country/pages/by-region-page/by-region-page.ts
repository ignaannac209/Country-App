import { Component, computed, inject } from '@angular/core';
import { CountryList } from '../../components/country-list/country-list';
import { Region } from '../../interfaces/region.type';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map, of } from 'rxjs';
import { Country } from '../../services/country';


function validateQueryParam(queryParam: string): Region {
  const normalizedQueryParam = queryParam.trim().toLowerCase();
  const validRegions: Record<string, Region> = {
    'africa': 'Africa',
    'americas': 'Americas',
    'asia': 'Asia',
    'europe': 'Europe',
    'oceania': 'Oceania',
    'antarctic': 'Antarctic',
  };
  return validRegions[normalizedQueryParam] ?? 'Americas';
}



@Component({
  selector: 'app-by-region-page',
  imports: [CountryList],
  templateUrl: './by-region-page.html',
})
export class ByRegionPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly countryService = inject(Country);

  readonly regions: Region[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];

  private readonly routeRegion = toSignal(
    this.route.queryParamMap.pipe(map(params => params.get('region'))),
    { initialValue: this.route.snapshot.queryParamMap.get('region') }
  );

  readonly selectedRegion = computed(() => {
    const region = this.routeRegion();
    return region ? validateQueryParam(region) : null;
  });

  readonly countryResources = rxResource({
    params: () => ({ region: this.selectedRegion() }),
    stream: ({ params }) => {
      if (!params.region) return of([]);

      return this.countryService.searchByRegion(params.region);
    },
  });

  selectRegion(region: Region): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { region },
      queryParamsHandling: 'merge',
    });
  }
}
