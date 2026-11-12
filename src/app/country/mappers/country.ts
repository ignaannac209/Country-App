import type { Country } from '../interfaces/country.interface';
import type { CountryItem } from '../interfaces/rest-countries';

export class CountryMapper {
  static mapCountryItemToCountry(country: CountryItem): Country {
    return {
      alpha_2: country.codes.alpha_2,
      flag: country.flag.emoji,
      url_svg: country.flag.url_svg,
      names: country.names.translations['spa']?.common ?? country.names.common,
      capitals: country.capitals?.length ? country.capitals.map(c => c.name).join(', ') : 'Sin capital',
      population: country.population,
      region: country.region,
      subregion: country.subregion,
    };
  }

  static mapCountryItemArrayToCountryArray(countryItems: CountryItem[] = []): Country[] {
    return countryItems.map(CountryMapper.mapCountryItemToCountry);
  }

  static mapApiResponseToCountryArray(response: unknown): Country[] {
    const payload = Array.isArray(response)
      ? response
      : (response as { data?: { objects?: CountryItem[] } } | null)?.data?.objects ??
        (response as { objects?: CountryItem[] } | null)?.objects ??
        [];

    return CountryMapper.mapCountryItemArrayToCountryArray(payload as CountryItem[]);
  }
}
