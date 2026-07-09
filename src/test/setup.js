import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';

// Global mocks if needed
global.localStorage = {
  getItem: (key) => key in localStorage ? localStorage[key] : null,
  setItem: (key, val) => { localStorage[key] = String(val); },
  removeItem: (key) => { delete localStorage[key]; },
  clear: () => { for (const key in localStorage) delete localStorage[key]; }
};
