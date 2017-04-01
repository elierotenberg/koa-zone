const { describe, it, before, after } = global;

import runZoneInPromise from '../lib/Zone';

describe('runZoneInPromise', () => {
  it('runs no-op function', () =>
    runZoneInPromise(() => void 0, {
      name: 'no-op',
    }));

  it('runs throwing function', done =>
    runZoneInPromise(
      () => {
        throw new Error('test');
      },
      {
        name: 'throwing',
      },
    )
      .then(() => done(new Error('should have thrown')))
      .catch(err => done()));
});
