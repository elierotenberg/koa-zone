const { describe, it, before, after } = global;
import chai from 'chai';
import chaiHttp from 'chai-http';
import Koa from 'koa';

import bindToZone, { recordSelfTime } from '../lib';
import now from '../lib/now';

chai.use(chaiHttp);
const { request, expect } = chai;

const sleep = duration => {
  const startTime = now();
  while (now() - startTime < duration) {
  }
};

describe('Integration with koa', () => {
  const app = new Koa()
    .use(bindToZone(recordSelfTime))
    .use(async (ctx, next) => {
      sleep(250);
      await Promise.resolve();
      sleep(250);
      await next();
    })
    .use((ctx, next) => {
      ctx.status = 200;
      ctx.body = { selfTime: ctx.state.getSelfTime() };
      next();
    });
  let server = null;
  before(done => {
    server = app.listen(5000, done);
  });
  it('Replies to ping and record self time', done => {
    request(server).get('/').end((err, res) => {
      if (err) {
        return done(err);
      }
      const { body } = res;
      chai.expect(body).to.be.an('object');
      chai.expect(body).to.have.property('selfTime');
      chai.expect(body.selfTime).to.be.a('number');
      chai.expect(body.selfTime).to.be.within(500, 550);
      done();
    });
  });
  after(() => server.close());
});
