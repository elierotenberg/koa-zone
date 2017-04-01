import 'zone.js';
const { Zone } = global;

class PromiseZoneSpec {
  constructor({ name, onFrame, ctx }) {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    this.name = name;
    this.onFrame = onFrame;
    this.ctx = ctx;
  }

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
    this.onFrame(this.ctx, runFrame);
  }

  onHandleError(parentZoneDelegate, currentZone, targetZone, err) {
    this.reject(err);
  }

  onHasTask(delegate, current, target, hasTaskState) {
    if (!hasTaskState.microTask && !hasTaskState.macroTask) {
      this.resolve();
    }
  }
}

export default function runZoneInPromise(
  start,
  { name, onFrame = (ctx, runFrame) => runFrame(), ctx = null },
) {
  const promiseZoneSpec = new PromiseZoneSpec({
    name,
    onFrame,
    ctx,
  });
  Zone.current.fork(promiseZoneSpec).run(() => process.nextTick(start));
  return promiseZoneSpec.promise;
}
