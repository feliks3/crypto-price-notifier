import {
  AppError,
  ValidationError,
  CoinNotFoundError,
  ExternalAPIError
} from '../../../src/utils/errors';

describe('error classes', () => {
  it('AppError should have correct properties', () => {
    const err = new AppError('TEST_ERROR', 'test message', 400);
    expect(err.code).toBe('TEST_ERROR');
    expect(err.message).toBe('test message');
    expect(err.statusCode).toBe(400);
    expect(err.name).toBe('AppError');
  });

  it('ValidationError should have 400 status and correct code', () => {
    const err = new ValidationError('invalid input');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(err.message).toBe('invalid input');
  });

  it('CoinNotFoundError should include coin name in message', () => {
    const err = new CoinNotFoundError('bitcoin');
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe('COIN_NOT_FOUND');
    expect(err.message).toContain('bitcoin');
  });

  it('ExternalAPIError should have 502 status', () => {
    const err = new ExternalAPIError('timeout');
    expect(err.statusCode).toBe(502);
    expect(err.code).toBe('EXTERNAL_API_ERROR');
  });

  it('all errors should be instances of AppError', () => {
    expect(new ValidationError('test')).toBeInstanceOf(AppError);
    expect(new CoinNotFoundError('eth')).toBeInstanceOf(AppError);
    expect(new ExternalAPIError('fail')).toBeInstanceOf(AppError);
  });
});
