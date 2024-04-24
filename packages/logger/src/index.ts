export const log = (...args: unknown[]) => {
  console.debug('logger: ', ...args);
};

export const debugLog = (...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.debug('logger: ', ...args);
  }
};
