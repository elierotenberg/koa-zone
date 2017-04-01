const { describe, it } = global;
import chai from 'chai';

import runZoneInPromise from '../lib/Zone';

describe('runZoneInPromise', () => {
  it('runs no-op function', () =>
    runZoneInPromise(() => void 0, {
      name: 'no-op',
    }));

  it('runs throwing function', async () => {
    let err = null;
    try {
      await runZoneInPromise(
        () => {
          throw new Error('test');
        },
        {
          name: 'throwing',
        },
      );
    } catch (_err) {
      err = _err;
    }
    chai.expect(err).to.be.an('error');
  });
});
