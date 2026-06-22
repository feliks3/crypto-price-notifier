import { getCoinPrice } from '../services/coingecko.service';
import { sendPriceEmail } from '../services/email.service';

interface PriceRequestBody {
  coin?: string;
  email?: string;
}

const jsonResponse = (statusCode: number, body: unknown) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
};

export const handler = async (event: { body?: string | null }) => {
  try {
    if (!event.body) {
      return jsonResponse(400, {
        message: 'Request body is required'
      });
    }

    const body = JSON.parse(event.body) as PriceRequestBody;

    if (!body.coin) {
      return jsonResponse(400, {
        message: 'coin is required'
      });
    }

    if (!body.email) {
      return jsonResponse(400, {
        message: 'email is required'
      });
    }

    const result = await getCoinPrice(body.coin);

    await sendPriceEmail({
      toEmail: body.email,
      coin: result.coin,
      currency: result.currency,
      price: result.price
    });

    return jsonResponse(200, {
      coin: result.coin,
      currency: result.currency,
      price: result.price,
      email: body.email,
      emailSent: true,
      lastUpdatedAt: result.lastUpdatedAt
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';

    return jsonResponse(500, {
      message
    });
  }
};
