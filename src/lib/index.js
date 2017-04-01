import runZoneInPromise from './Zone';
import guid from './guid';
import now from './now';

const $selfTime = Symbol('selfTime');

export function recordSelfTime(ctx, runFrame) {
  if (!ctx.state[$selfTime]) {
    ctx.state[$selfTime] = {
      timeAcc: 0,
      lastSelfTime: null,
    };
    ctx.state.getSelfTime = () =>
      ctx.state[$selfTime].timeAcc +
      (now() - ctx.state[$selfTime].lastSelfTime);
  }
  const timeBeforeFrame = now();
  runFrame();
  const timeAfterFrame = now();
  const frameDuration = timeAfterFrame - timeBeforeFrame;
  ctx.state[$selfTime].timeAcc = ctx.state[$selfTime].timeAcc + frameDuration;
  ctx.state[$selfTime].lastSelfTime = timeAfterFrame;
}

export default onFrame =>
  (ctx, next) =>
    runZoneInPromise(next, {
      name: `koa-zone-${guid()}`,
      onFrame,
      ctx,
    });
