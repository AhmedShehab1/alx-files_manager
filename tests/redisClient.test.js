import chai from 'chai';
import sinon from 'sinon';
import redisClient from '../utils/redis.js';

sinon.stub(console, 'log');

describe('redisClient test', () => {
  it('isAlive when redis not started', () => new Promise((done) => {
    let i = 0;
    const repeatFct = () => {
      setTimeout(() => {
        let cResult;
        try {
          cResult = redisClient.isAlive();
        } catch (error) {
          cResult = false;
        }
        chai.assert.isFalse(cResult);
        i += 1;
        if (i >= 5) {
          done();
        } else {
          repeatFct();
        }
      }, 1000);
    };
    repeatFct();
  })).timeout(10000);
});

describe('redisClient test', () => {
  it('isAlive when redis started', () => new Promise((done) => {
    let i = 0;
    const repeatFct = async () => {
      setTimeout(() => {
            i += 1;
            if (i >= 5) {
                chai.assert.isTrue(false);
                done();
            } else if (!redisClient.isAlive()) {
                repeatFct();
            } else {
                chai.assert.isTrue(true);
                done();
            }
        }, 1000);
    };
    repeatFct();
  })).timeout(10000);
});
