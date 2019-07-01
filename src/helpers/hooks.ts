import * as React from 'react';

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook that ignores the first invocation (e.g. on mount).
 * The signature is exactly the same as `useEffect`.
 */
export const useUpdateEffect: typeof React.useEffect = (effect, deps) => {
  const isInitialMount = React.useRef(true);

  React.useEffect(
    isInitialMount.current
      ? () => {
          isInitialMount.current = false;
        }
      : effect,
    deps
  );
};
