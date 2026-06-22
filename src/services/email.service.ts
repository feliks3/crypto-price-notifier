import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { config } from '../config';

const sesClient = new SESClient({ region: config.ses.region });

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
  const command = new SendEmailCommand({
    Source: config.ses.fromEmail,
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
