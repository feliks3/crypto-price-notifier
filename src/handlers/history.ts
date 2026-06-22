import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { withErrorHandler } from '../utils/errorHandler';
import { successResponse } from '../utils/response';
import { logger } from '../utils/logger';
import { getPriceHistory } from '../repositories/price-history.repository';

const searchHistoryHandler = async (
  _event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('History request received');

  const items = await getPriceHistory();
  logger.info('History fetched', { count: items.length });
  return successResponse({ items });
};

export const handler = withErrorHandler(searchHistoryHandler);
