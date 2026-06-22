import { requireEnv } from '../utils/env';

export const config = {
  coingecko: {
    baseUrl: process.env.COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3',
    currency: 'usd'
  },
  dynamodb: {
    tableName: requireEnv('PRICE_HISTORY_TABLE')
  },
  ses: {
    fromEmail: requireEnv('SES_FROM_EMAIL'),
    region: process.env.AWS_REGION || 'ap-southeast-2'
  }
};
