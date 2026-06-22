import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'ap-southeast-2'
});

interface SendPriceEmailParams {
  toEmail: string;
  coin: string;
  currency: string;
  price: number;
}

export const sendPriceEmail = async ({
  toEmail,
  coin,
  currency,
  price
}: SendPriceEmailParams): Promise<void> => {
  const fromEmail = process.env.SES_FROM_EMAIL;

  if (!fromEmail) {
    throw new Error('SES_FROM_EMAIL environment variable is not configured');
  }

  const command = new SendEmailCommand({
    Source: fromEmail,
    Destination: {
      ToAddresses: [toEmail]
    },
    Message: {
      Subject: {
        Data: `Crypto price: ${coin}`,
        Charset: 'UTF-8'
      },
      Body: {
        Text: {
          Data: `Current price of ${coin} is ${price} ${currency.toUpperCase()}.`,
          Charset: 'UTF-8'
        }
      }
    }
  });

  await sesClient.send(command);
};
