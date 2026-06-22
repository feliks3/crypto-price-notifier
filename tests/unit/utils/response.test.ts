import { successResponse, errorResponse } from '../../../src/utils/response';

describe('response utils', () => {
  describe('successResponse', () => {
    it('should return 200 with success true and data', () => {
      const result = successResponse({ foo: 'bar' });
      expect(result.statusCode).toBe(200);
      const body = JSON.parse(result.body);
      expect(body.success).toBe(true);
      expect(body.data).toEqual({ foo: 'bar' });
    });

    it('should allow custom status code', () => {
      const result = successResponse({}, 201);
      expect(result.statusCode).toBe(201);
    });

    it('should include CORS header', () => {
      const result = successResponse({});
      expect(result.headers['Access-Control-Allow-Origin']).toBe('*');
    });
  });

  describe('errorResponse', () => {
    it('should return correct error structure', () => {
      const result = errorResponse('NOT_FOUND', 'resource not found', 404);
      expect(result.statusCode).toBe(404);
      const body = JSON.parse(result.body);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('NOT_FOUND');
      expect(body.error.message).toBe('resource not found');
    });

    it('should default to 500 status code', () => {
      const result = errorResponse('INTERNAL_ERROR', 'something went wrong');
      expect(result.statusCode).toBe(500);
    });
  });
});
