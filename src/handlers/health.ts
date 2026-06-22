import { successResponse } from '../utils/response';

export const handler = async () => {
  return successResponse({ status: 'ok', service: 'crypto-price-notifier' });
};
