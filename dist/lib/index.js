'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

exports.recordSelfTime = recordSelfTime;
exports.default = bindToZone;

var _Zone = require('./Zone');

var _Zone2 = _interopRequireDefault(_Zone);

var _guid = require('./guid');

var _guid2 = _interopRequireDefault(_guid);

var _now = require('./now');

var _now2 = _interopRequireDefault(_now);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const $selfTime = (0, _symbol2.default)('selfTime');

function recordSelfTime(ctx, runFrame) {
  if (!ctx.state[$selfTime]) {
    ctx.state[$selfTime] = {
      timeAcc: 0,
      lastSelfTime: null
    };
    ctx.state.getSelfTime = () => ctx.state[$selfTime].timeAcc + ((0, _now2.default)() - ctx.state[$selfTime].lastSelfTime);
  }
  const timeBeforeFrame = (0, _now2.default)();
  runFrame();
  const timeAfterFrame = (0, _now2.default)();
  const frameDuration = timeAfterFrame - timeBeforeFrame;
  ctx.state[$selfTime].timeAcc = ctx.state[$selfTime].timeAcc + frameDuration;
  ctx.state[$selfTime].lastSelfTime = timeAfterFrame;
}

function bindToZone(onFrame) {
  return async (ctx, next) => {
    const zone = ctx.state.zone = (0, _Zone2.default)(`koa-zone-${(0, _guid2.default)()}`, onFrame, ctx);
    zone.run(next);
  };
}