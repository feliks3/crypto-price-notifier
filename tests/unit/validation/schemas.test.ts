import { cryptoPriceSchema, validateRequest } from '../../../src/validation';
import { ValidationError } from '../../../src/utils/errors';

describe('validateRequest', () => {
  describe('cryptoPriceSchema', () => {
    it('should pass with valid coin and email', () => {
      const result = validateRequest(cryptoPriceSchema, {
        coin: 'bitcoin',
        email: 'test@example.com'
      });
      expect(result.coin).toBe('bitcoin');
      expect(result.email).toBe('test@example.com');
    });

    it('should throw ValidationError when coin is missing', () => {
      expect(() => validateRequest(cryptoPriceSchema, { email: 'test@example.com' })).toThrow(
        ValidationError
      );
    });

    it('should throw ValidationError when email is missing', () => {
      expect(() => validateRequest(cryptoPriceSchema, { coin: 'bitcoin' })).toThrow(
        ValidationError
      );
    });

    it('should throw ValidationError when email format is invalid', () => {
      expect(() =>
        validateRequest(cryptoPriceSchema, { coin: 'bitcoin', email: 'not-an-email' })
      ).toThrow(ValidationError);
    });

    it('should throw ValidationError when coin is empty string', () => {
      expect(() =>
        validateRequest(cryptoPriceSchema, { coin: '', email: 'test@example.com' })
      ).toThrow(ValidationError);
    });
  });
});
