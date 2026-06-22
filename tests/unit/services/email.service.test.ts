import { sendPriceEmail } from '../../../src/services/email.service';

const mockSend = jest.fn();

jest.mock('@aws-sdk/client-ses', () => ({
  SESClient: jest.fn().mockImplementation(() => ({ send: mockSend })),
  SendEmailCommand: jest.fn().mockImplementation((input) => input)
}));

describe('sendPriceEmail', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    mockSend.mockReset();
    process.env = { ...originalEnv, SES_FROM_EMAIL: 'from@example.com' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should call SES with correct parameters', async () => {
    mockSend.mockResolvedValueOnce({});

    await sendPriceEmail({
      toEmail: 'to@example.com',
      coin: 'bitcoin',
      currency: 'usd',
      price: 67432.21
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it('should throw error when SES_FROM_EMAIL is not set', async () => {
    delete process.env.SES_FROM_EMAIL;

    await expect(
      sendPriceEmail({
        toEmail: 'to@example.com',
        coin: 'bitcoin',
        currency: 'usd',
        price: 67432.21
      })
    ).rejects.toThrow('SES_FROM_EMAIL environment variable is not configured');
  });

  it('should throw error when SES send fails', async () => {
    mockSend.mockRejectedValueOnce(new Error('SES error'));

    await expect(
      sendPriceEmail({
        toEmail: 'to@example.com',
        coin: 'bitcoin',
        currency: 'usd',
        price: 67432.21
      })
    ).rejects.toThrow('SES error');
  });
});
