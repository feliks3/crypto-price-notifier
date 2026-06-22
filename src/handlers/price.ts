import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { withErrorHandler } from '../utils/errorHandler';
import { successResponse } from '../utils/response';
import { logger } from '../utils/logger';
import { getCoinPrice } from '../services/coingecko.service';
import { sendPriceEmail } from '../services/email.service';
import { savePriceHistory } from '../repositories/price-history.repository';
import { cryptoPriceSchema, validateRequest } from '../validation/schemas';
import { ValidationError } from '../utils/errors';

const cryptoPriceHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Price request received', { body: event.body });

  if (!event.body) {
    throw new ValidationError('Request body is required');
  }

  const body = validateRequest(cryptoPriceSchema, JSON.parse(event.body));

  const result = await getCoinPrice(body.coin);

  logger.info('Price fetched', { coin: result.coin, price: result.price });

  await Promise.allSettled([
    sendPriceEmail({
      toEmail: body.email,
      coin: result.coin,
      currency: result.currency,
      price: result.price
    }),
    savePriceHistory({
      coin: result.coin,
      price: result.price,
      currency: result.currency,
      email: body.email
    })
  ]);

  logger.info('Price request completed', { coin: result.coin, email: body.email });

  return successResponse({
    coin: result.coin,
    currency: result.currency,
    price: result.price,
    email: body.email,
    emailSent: true,
    lastUpdatedAt: result.lastUpdatedAt
  });
};

export const handler = withErrorHandler(cryptoPriceHandler);
