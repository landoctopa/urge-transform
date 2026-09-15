import {
  type TCurrencyCode,
} from 'countries-list';
import { currencies} from 'countries-list/currencies'


export type CurrencyCode = TCurrencyCode;

export interface CurrencyOption {
  code: CurrencyCode;
  name: string;
  symbol: string;
  decimals: number;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = Object.entries(
  currencies,
)
  .map(([code, currency]) => ({
    code: code as CurrencyCode,
    name: currency.name,
    symbol: currency.symbol,
    decimals: currency.decimals,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function getCurrency(code: string | null | undefined) {
  if (!code) {
    return null;
  }

  return currencies[code as CurrencyCode] ?? null;
}