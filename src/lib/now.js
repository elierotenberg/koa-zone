export default (typeof performance !== 'undefined' &&
  typeof performance.now === 'function'
  ? () => performance.now()
  : () => Date.now());
