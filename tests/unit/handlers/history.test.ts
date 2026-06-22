import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../../src/handlers/history';

const mockGetPriceHistory = jest.fn();

jest.mock('../../../src/repositories/price-history.repository', () => ({
  getPriceHistory: () => mockGetPriceHistory()
}));

const mockEvent = (): APIGatewayProxyEvent => ({}) as APIGatewayProxyEvent;

describe('history handler', () => {
  beforeEach(() => {
    mockGetPriceHistory.mockReset();
  });

  it('should return 200 with history items', async () => {
    mockGetPriceHistory.mockResolvedValueOnce([
      {
        email: 'test@example.com',
        createdAt: '2024-01-15T10:30:00.000Z',
        coin: 'bitcoin',
        price: 67432.21,
        currency: 'usd'
      }
    ]);

    const result = await handler(mockEvent());
    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.success).toBe(true);
    expect(body.data.items).toHaveLength(1);
  });

  it('should return 200 with empty array when no history', async () => {
    mockGetPriceHistory.mockResolvedValueOnce([]);

    const result = await handler(mockEvent());
    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.data.items).toEqual([]);
  });

  it('should return 500 when repository throws', async () => {
    mockGetPriceHistory.mockRejectedValueOnce(new Error('DB error'));

    const result = await handler(mockEvent());
    expect(result.statusCode).toBe(500);
  });
});
