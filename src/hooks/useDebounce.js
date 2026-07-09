import { useEffect, useRef } from 'react';

/**
 * useDebounce - delays executing a callback after a delay
 * @param {Function} callback - function to debounce
 * @param {number} delay - delay in ms
 * @returns debounced function
 */
const useDebounce = (callback, delay) => {
  const timerRef = useRef(null);

  const debouncedFn = (...args) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return debouncedFn;
};

export default useDebounce;
