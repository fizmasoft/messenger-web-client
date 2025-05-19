export const ENV = {
  isBrowser: typeof window === 'object' && '[object Window]' === window.toString.call(window),
  isNode: typeof global === 'object' && '[object global]' === global.toString.call(global),
};
