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

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = React.useRef<T>();

  React.useEffect(() => {
    ref.current = value;
  });

  return ref.current;
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

export const useClickOutside = (
  elemRef: React.RefObject<any>,
  fn: (event: Event) => void
) => {
  React.useEffect(() => {
    const clickOutside = (event: Event) => {
      if (
        event.target &&
        elemRef &&
        elemRef.current &&
        !elemRef.current.contains(event.target)
      ) {
        fn(event);
      }
    };

    document.addEventListener('click', clickOutside, true);

    return () => {
      document.removeEventListener('click', clickOutside, true);
    };
  });
};
