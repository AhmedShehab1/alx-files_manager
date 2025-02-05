import chai from 'chai';
import dbClient from '../utils/db.js';

describe('dbClient test', () => {
  it('isAlive when mongodb not started', () => new Promise((done) => {
    let i = 0;
    const repeatFct = async () => {
      setTimeout(() => {
            chai.assert.isFalse(dbClient.isAlive());
            i += 1;
            if (i >= 5) {
                done();
            } else {
                repeatFct();
            }
        }, 1000);
    };
    repeatFct();
  })).timeout(20000);
});
