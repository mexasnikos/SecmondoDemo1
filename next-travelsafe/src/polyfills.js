/* eslint-disable no-restricted-globals */
// Polyfill for globalThis
if (typeof globalThis === 'undefined') {
  (function() {
    if (typeof global !== 'undefined') {
      global.globalThis = global;
    } else if (typeof window !== 'undefined') {
      window.globalThis = window;
    } else if (typeof self !== 'undefined') {
      self.globalThis = self;
    } else {
      throw new Error('Unable to locate global object');
    }
  })();
}
