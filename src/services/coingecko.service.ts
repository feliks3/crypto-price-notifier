import { config } from '../config';
import { CoinNotFoundError, ExternalAPIError } from '../utils/errors';

export interface CoinPrice {
  coin: string;
  currency: string;
  price: number;
  lastUpdatedAt?: number;
}

interface CoinGeckoSimplePriceResponse {
  [coinId: string]: {
    usd?: number;
    last_updated_at?: number;
  };
}

export const getCoinPrice = async (coin: string): Promise<CoinPrice> => {
  const normalizedCoin = coin.trim().toLowerCase();

  const url = new URL(`${config.coingecko.baseUrl}/simple/price`);
  url.searchParams.set('ids', normalizedCoin);
  url.searchParams.set('vs_currencies', config.coingecko.currency);
  url.searchParams.set('include_last_updated_at', 'true');

  let response: Response;

  try {
    response = await fetch(url);
  } catch (err) {
    throw new ExternalAPIError(
      `CoinGecko request failed: ${err instanceof Error ? err.message : 'network error'}`
    );
  }

  if (!response.ok) {
    throw new ExternalAPIError(`CoinGecko request failed with status ${response.status}`);
  }

  const data = (await response.json()) as CoinGeckoSimplePriceResponse;
  const price = data[normalizedCoin]?.usd;

  if (typeof price !== 'number') {
    throw new CoinNotFoundError(normalizedCoin);
  }

  return {
    coin: normalizedCoin,
    currency: config.coingecko.currency,
    price,
    lastUpdatedAt: data[normalizedCoin]?.last_updated_at
  };
};
