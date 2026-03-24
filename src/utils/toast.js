// Lightweight pub/sub toast emitter — no external dependencies.
const listeners = new Set();

const emit = (t) => listeners.forEach((fn) => fn(t));

export const toast = {
  success: (message) => emit({ type: 'success', message, id: Date.now() + Math.random() }),
  error:   (message) => emit({ type: 'error',   message, id: Date.now() + Math.random() }),
  info:    (message) => emit({ type: 'info',     message, id: Date.now() + Math.random() }),
  /** @returns {() => void} unsubscribe function */
  _subscribe: (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
