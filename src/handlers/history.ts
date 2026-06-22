import type { APIGatewayProxyHandler } from 'aws-lambda';
import { getPriceHistory } from '../repositories/price-history.repository';

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const items = await getPriceHistory();

    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      })
    };
  } catch (error) {
    console.error('Failed to get price history', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to get price history'
      })
    };
  }
};
