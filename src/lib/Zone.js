import 'zone.js';
const { Zone } = global;

export default function createZone(name, onFrame = () => void 0, ctx = null) {
  const zoneSpec = {
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
  };
  return Zone.current.fork(zoneSpec);
}
