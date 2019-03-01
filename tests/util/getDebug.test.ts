import { getDebug } from '../../src/util/getDebug';

describe('getDebug', () => {
  it('exists', () => {
    expect(typeof getDebug).toEqual('function');
  });

  it('returns an instance of debug', () => {
    const result = getDebug('test-cloud');

    expect(typeof result).toEqual('function');
  });
});
