import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Country } from '../../services/country';
import { rxResource } from '@angular/core/rxjs-interop';
import { NotFound } from '../../../shared/componentes/footer/not-found/not-found';
import { CountryInformation } from './country-information/country-information';

@Component({
  selector: 'app-country-page',
  imports: [NotFound, CountryInformation],
  templateUrl: './country-page.html',
})
export class CountryPage {
  countryCode = inject(ActivatedRoute).snapshot.params['code'];
  countryService = inject(Country);

  countryResource = rxResource({
    params: () => ({ code: this.countryCode }),
    stream: ({ params }) =>
      this.countryService.searchCountryByAlphaCode(params.code),
  });
}
