export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super('VALIDATION_ERROR', message, 400);
  }
}

export class CoinNotFoundError extends AppError {
  constructor(coin: string) {
    super('COIN_NOT_FOUND', `Coin "${coin}" not found`, 404);
  }
}

export class ExternalAPIError extends AppError {
  constructor(message: string) {
    super('EXTERNAL_API_ERROR', message, 502);
  }
}
