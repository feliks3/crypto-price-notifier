import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AppError } from './errors';
import { errorResponse } from './response';
import { logger } from './logger';

type Handler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;

export const withErrorHandler =
  (handler: Handler): Handler =>
  async (event: APIGatewayProxyEvent) => {
    try {
      return await handler(event);
    } catch (err) {
      if (err instanceof AppError) {
        logger.warn('Handled error', { code: err.code, message: err.message });
        return errorResponse(err.code, err.message, err.statusCode);
      }
      logger.error('Unhandled error', { err });
      return errorResponse('INTERNAL_ERROR', 'Something went wrong', 500);
    }
  };
