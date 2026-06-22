import {
  savePriceHistory,
  getPriceHistory
} from '../../../src/repositories/price-history.repository';

jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('@aws-sdk/lib-dynamodb', () => {
  const send = jest.fn();
  (global as any).__mockDynamoSend = send;
  return {
    DynamoDBDocumentClient: {
      from: jest.fn().mockImplementation(() => ({ send }))
    },
    PutCommand: jest.fn().mockImplementation((input) => input),
    ScanCommand: jest.fn().mockImplementation((input) => input)
  };
});

describe('price-history repository', () => {
  const originalEnv = process.env;
  let mockSend: jest.Mock;

  beforeEach(() => {
    mockSend = (global as any).__mockDynamoSend;
    mockSend.mockReset();
    process.env = { ...originalEnv, PRICE_HISTORY_TABLE: 'test-table' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('savePriceHistory', () => {
    it('should save item and return it with email and createdAt as keys', async () => {
      mockSend.mockResolvedValueOnce({});

      const result = await savePriceHistory({
        email: 'test@example.com',
        coin: 'bitcoin',
        price: 67432.21,
        currency: 'usd'
      });

      expect(result.email).toBe('test@example.com');
      expect(result.coin).toBe('bitcoin');
      expect(result.price).toBe(67432.21);
      expect(result.createdAt).toBeDefined();
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('should throw when PRICE_HISTORY_TABLE is not set', async () => {
      delete process.env.PRICE_HISTORY_TABLE;

      await expect(
        savePriceHistory({
          email: 'test@example.com',
          coin: 'bitcoin',
          price: 67432.21,
          currency: 'usd'
        })
      ).rejects.toThrow('PRICE_HISTORY_TABLE is not configured');
    });
  });

  describe('getPriceHistory', () => {
    it('should return items from DynamoDB', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [
          {
            email: 'test@example.com',
            createdAt: '2024-01-15T10:30:00.000Z',
            coin: 'bitcoin',
            price: 67432.21,
            currency: 'usd'
          }
        ]
      });

      const result = await getPriceHistory();
      expect(result).toHaveLength(1);
      expect(result[0].email).toBe('test@example.com');
    });

    it('should return empty array when no items', async () => {
      mockSend.mockResolvedValueOnce({ Items: undefined });
      const result = await getPriceHistory();
      expect(result).toEqual([]);
    });

    it('should throw when PRICE_HISTORY_TABLE is not set', async () => {
      delete process.env.PRICE_HISTORY_TABLE;
      await expect(getPriceHistory()).rejects.toThrow('PRICE_HISTORY_TABLE is not configured');
    });
  });
});
