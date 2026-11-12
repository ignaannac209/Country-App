import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Country } from '../../../interfaces/country.interface';

@Component({
  selector: 'app-country-information',
  imports: [DecimalPipe],
  templateUrl: './country-information.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class CountryInformation {

  country = input.required<Country>();


  currentYear = computed(() =>{
    return new Date().getFullYear();
  })

}

