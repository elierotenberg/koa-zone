import 'zone.js';
const { Zone } = global;

import nextTick from './nextTick';

const createPromiseZoneSpec = (
  resolve,
  reject,
  {
    name,
    onFrame,
    ctx,
  },
) => ({
  name,

  onInvoke(
    parentZoneDelegate,
    currentZone,
    targetZone,
    delegate,
    applyThis,
    applysArgs,
    source,
  ) {
    const runFrame = () =>
      parentZoneDelegate.invoke(
        targetZone,
        delegate,
        applyThis,
        applysArgs,
        source,
      );
    onFrame(ctx, runFrame);
  },

  onHandleError(parentZoneDelegate, currentZone, targetZone, err) {
    reject(err);
  },

  onHasTask(delegate, current, target, hasTaskState) {
    if (!hasTaskState.microTask && !hasTaskState.macroTask) {
      resolve();
    }
  },
});

export default function runZoneInPromise(
  start,
  { name, onFrame = (ctx, runFrame) => runFrame(), ctx = null },
) {
  return new Promise((resolve, reject) =>
    Zone.current
      .fork(
        createPromiseZoneSpec(resolve, reject, {
          name,
          onFrame,
          ctx,
        }),
      )
      // Run 'start' in next tick to avoid Zalgo
      .run(() => nextTick().then(start)));
}
