import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../../src/handlers/price';

const mockGetCoinPrice = jest.fn();
const mockSendPriceEmail = jest.fn();
const mockSavePriceHistory = jest.fn();

jest.mock('../../../src/services/coingecko.service', () => ({
  getCoinPrice: (...args: unknown[]) => mockGetCoinPrice(...args)
}));

jest.mock('../../../src/services/email.service', () => ({
  sendPriceEmail: (...args: unknown[]) => mockSendPriceEmail(...args)
}));

jest.mock('../../../src/repositories/price-history.repository', () => ({
  savePriceHistory: (...args: unknown[]) => mockSavePriceHistory(...args)
}));

const mockEvent = (body: unknown): APIGatewayProxyEvent =>
  ({ body: JSON.stringify(body) }) as APIGatewayProxyEvent;

describe('price handler', () => {
  beforeEach(() => {
    mockGetCoinPrice.mockReset();
    mockSendPriceEmail.mockReset();
    mockSavePriceHistory.mockReset();
  });

  it('should return 200 with price data on success', async () => {
    mockGetCoinPrice.mockResolvedValueOnce({
      coin: 'bitcoin',
      price: 67432.21,
      currency: 'usd',
      lastUpdatedAt: 1234567890
    });
    mockSendPriceEmail.mockResolvedValueOnce({});
    mockSavePriceHistory.mockResolvedValueOnce({});

    const result = await handler(mockEvent({ coin: 'bitcoin', email: 'test@example.com' }));

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.success).toBe(true);
    expect(body.data.coin).toBe('bitcoin');
    expect(body.data.price).toBe(67432.21);
    expect(body.data.emailSent).toBe(true);
  });

  it('should return 400 when body is missing', async () => {
    const result = await handler({ body: null } as APIGatewayProxyEvent);
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when coin is missing', async () => {
    const result = await handler(mockEvent({ email: 'test@example.com' }));
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 when email format is invalid', async () => {
    const result = await handler(mockEvent({ coin: 'bitcoin', email: 'not-an-email' }));
    expect(result.statusCode).toBe(400);
  });

  it('should return 502 when CoinGecko fails', async () => {
    const { ExternalAPIError } = await import('../../../src/utils/errors');
    mockGetCoinPrice.mockRejectedValueOnce(new ExternalAPIError('API timeout'));

    const result = await handler(mockEvent({ coin: 'bitcoin', email: 'test@example.com' }));
    expect(result.statusCode).toBe(502);
  });

  it('should return 200 even when email service fails', async () => {
    mockGetCoinPrice.mockResolvedValueOnce({
      coin: 'bitcoin',
      price: 67432.21,
      currency: 'usd'
    });
    mockSendPriceEmail.mockRejectedValueOnce(new Error('SES error'));
    mockSavePriceHistory.mockResolvedValueOnce({});

    const result = await handler(mockEvent({ coin: 'bitcoin', email: 'test@example.com' }));
    expect(result.statusCode).toBe(200);
  });
});
