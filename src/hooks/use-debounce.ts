/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from 'react';

export function useDebounce(callback:any, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunction = (...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debouncedFunction;
}

export default useDebounce;