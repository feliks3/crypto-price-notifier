import { requireEnv } from '../../../src/utils/env';

describe('requireEnv', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return value when env var exists', () => {
    process.env.TEST_VAR = 'hello';
    expect(requireEnv('TEST_VAR')).toBe('hello');
  });

  it('should throw when env var is missing', () => {
    delete process.env.TEST_VAR;
    expect(() => requireEnv('TEST_VAR')).toThrow('Missing required environment variable: TEST_VAR');
  });
});
