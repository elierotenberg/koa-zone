import Zone from 'zone.js';

let zoneId = 0;

function defaultCreateZoneSpec(koaContext) {
  const zoneSpec = {
    name: `koa-request-${zoneId}`,
  };
  zoneId = zoneId + 1;
  return zoneSpec;
}

function bindRequestToZone(createZoneSpec) {
  return function* $bindRequestToZone(next) {
    const zone = Zone.current
      .fork((createZoneSpec || defaultCreateZoneSpec)(this))
      .run(next);
  };
}

export default bindRequestToZone;
