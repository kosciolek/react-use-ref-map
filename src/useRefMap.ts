import { Ref, RefCallback, useCallback, useEffect, useRef } from "react";

export type UseRefMapListener = (
  key: string | number,
  element: HTMLElement | null,
  refs: Ref<Record<string | number, HTMLElement>>
) => void;

export function useRefMap(
  listeners: {
    onChange?: UseRefMapListener;
    onEnter?: UseRefMapListener;
    onLeave?: UseRefMapListener;
  } = {}
) {
  const elementsRef = useRef<Record<string | number, HTMLElement>>({});
  const funcsRef = useRef<Record<string | number, RefCallback<HTMLElement>>>(
    {}
  );

  const callbackRef = useRef(listeners);
  useEffect(() => {
    callbackRef.current = listeners;
  });

  const setRef = useCallback((key: string | number) => {
    if (!funcsRef.current[key]) {
      funcsRef.current[key] = (elem: HTMLElement | null) => {
        if (elem) {
          elementsRef.current[key] = elem;
          callbackRef.current.onEnter?.(key, elem, elementsRef);
        } else {
          delete funcsRef.current[key];
          delete elementsRef.current[key];
          callbackRef.current.onLeave?.(key, elem, elementsRef);
        }
        callbackRef.current.onChange?.(key, elem, elementsRef);
      };
    }

    return funcsRef.current[key];
  }, []);

  return [setRef, elementsRef] as const;
}
