import { sendPriceEmail } from '../../../src/services/email.service';

const mockSend = jest.fn();

jest.mock('../../../src/config', () => ({
  get config() {
    return {
      ses: {
        fromEmail: process.env.SES_FROM_EMAIL,
        region: 'ap-southeast-2'
      }
    };
  }
}));

jest.mock('@aws-sdk/client-ses', () => ({
  SESClient: jest.fn().mockImplementation(() => ({
    send: (...args: unknown[]) => mockSend(...args)
  })),
  SendEmailCommand: jest.fn().mockImplementation((input) => input)
}));

describe('sendPriceEmail', () => {
  beforeEach(() => {
    mockSend.mockReset();
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
