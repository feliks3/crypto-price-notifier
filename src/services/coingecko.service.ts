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

  const url = new URL('https://api.coingecko.com/api/v3/simple/price');
  url.searchParams.set('ids', normalizedCoin);
  url.searchParams.set('vs_currencies', 'usd');
  url.searchParams.set('include_last_updated_at', 'true');

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`CoinGecko request failed with status ${response.status}`);
  }

  const data = (await response.json()) as CoinGeckoSimplePriceResponse;

  const price = data[normalizedCoin]?.usd;

  if (typeof price !== 'number') {
    throw new Error(`Price not found for coin: ${normalizedCoin}`);
  }

  return {
    coin: normalizedCoin,
    currency: 'usd',
    price,
    lastUpdatedAt: data[normalizedCoin]?.last_updated_at
  };
};
