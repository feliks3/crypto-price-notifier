import { getCoinPrice } from '../../../src/services/coingecko.service';
import { CoinNotFoundError, ExternalAPIError } from '../../../src/utils/errors';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('getCoinPrice', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('should return price for a valid coin', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        bitcoin: { usd: 67432.21, last_updated_at: 1234567890 }
      })
    });

    const result = await getCoinPrice('bitcoin');
    expect(result.coin).toBe('bitcoin');
    expect(result.price).toBe(67432.21);
    expect(result.currency).toBe('usd');
    expect(result.lastUpdatedAt).toBe(1234567890);
  });

  it('should normalize coin name to lowercase', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        bitcoin: { usd: 67432.21 }
      })
    });

    const result = await getCoinPrice('  BITCOIN  ');
    expect(result.coin).toBe('bitcoin');
  });

  it('should throw CoinNotFoundError when coin is not in response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    });

    await expect(getCoinPrice('fakecoin')).rejects.toThrow(CoinNotFoundError);
  });

  it('should throw ExternalAPIError when response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429
    });

    await expect(getCoinPrice('bitcoin')).rejects.toThrow(ExternalAPIError);
  });

  it('should throw ExternalAPIError when fetch throws network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network error'));

    await expect(getCoinPrice('bitcoin')).rejects.toThrow(ExternalAPIError);
  });
});
