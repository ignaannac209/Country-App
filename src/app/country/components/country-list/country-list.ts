import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Country as CountryModel } from '../../interfaces/country.interface';

@Component({
  selector: 'country-list',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './country-list.html',
})
export class CountryList {
  countries = input.required<CountryModel[]>();

  errorMessage = input<unknown | null>(null);
  isLoading = input<boolean>(false);
  isEmpty = input<boolean>(false);

  errorText = computed(() => {
    const error = this.errorMessage();

    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return error ? 'No se pudo completar la búsqueda. Intenta de nuevo.' : null;
  });
}
