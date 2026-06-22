import { APIGatewayProxyEvent } from 'aws-lambda';
import { withErrorHandler } from '../../../src/utils/errorHandler';
import { AppError, ValidationError } from '../../../src/utils/errors';

const mockEvent = {} as APIGatewayProxyEvent;

describe('withErrorHandler', () => {
  it('should return handler result when no error thrown', async () => {
    const handler = withErrorHandler(async () => ({
      statusCode: 200,
      headers: {},
      body: JSON.stringify({ success: true, data: {} })
    }));

    const result = await handler(mockEvent);
    expect(result.statusCode).toBe(200);
  });

  it('should return correct status code when AppError is thrown', async () => {
    const handler = withErrorHandler(async () => {
      throw new ValidationError('invalid input');
    });

    const result = await handler(mockEvent);
    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should return 500 when unknown error is thrown', async () => {
    const handler = withErrorHandler(async () => {
      throw new Error('unexpected');
    });

    const result = await handler(mockEvent);
    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.error.code).toBe('INTERNAL_ERROR');
  });

  it('should return correct status for any AppError subclass', async () => {
    const handler = withErrorHandler(async () => {
      throw new AppError('CUSTOM_ERROR', 'custom message', 422);
    });

    const result = await handler(mockEvent);
    expect(result.statusCode).toBe(422);
    const body = JSON.parse(result.body);
    expect(body.error.code).toBe('CUSTOM_ERROR');
  });
});
