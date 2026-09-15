import {
  countries,
  type TCountryCode,
} from 'countries-list';

export type CountryCode = TCountryCode;

export interface CountryOption {
  code: CountryCode;
  name: string;
  currency: string;
}

export const COUNTRY_OPTIONS: CountryOption[] = Object.entries(
  countries,
)
  .map(([code, country]) => ({
    code: code as CountryCode,
    name: country.name,
    currency: country.currency[0] ?? '',
  }))
  .filter((country) => country.currency)
  .sort((a, b) => a.name.localeCompare(b.name));

export function getCountry(code: string | null | undefined) {
  if (!code) {
    return null;
  }

  return countries[code as CountryCode] ?? null;
}

export function getCountryCurrency(
  countryCode: string | null | undefined,
) {
  const country = getCountry(countryCode);

  return country?.currency[0] ?? null;
}