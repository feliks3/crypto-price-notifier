import { getHealthStatus } from '../../../src/shared/health';

describe('getHealthStatus', () => {
  it('returns service health status', () => {
    expect(getHealthStatus()).toEqual({
      status: 'ok',
      service: 'crypto-price-notifier'
    });
  });
});
