import { Ref, RefCallback, useCallback, useEffect, useRef } from "react";

export type ElementMap = Record<string | number, HTMLElement>;
export type Key = string | number;

export function useRefMap(
  listeners: {
    onChange?: (
      key: Key,
      element: HTMLElement | null,
      refs: Ref<ElementMap>
    ) => void;
    onEnter?: (key: Key, element: HTMLElement, refs: Ref<ElementMap>) => void;
    onLeave?: (key: Key, element: HTMLElement, refs: Ref<ElementMap>) => void;
  } = {}
) {
  const elementsRef = useRef<ElementMap>({});
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
          const deletedElem = elementsRef.current[key];
          delete funcsRef.current[key];
          delete elementsRef.current[key];
          callbackRef.current.onLeave?.(key, deletedElem, elementsRef);
        }
        callbackRef.current.onChange?.(key, elem, elementsRef);
      };
    }

    return funcsRef.current[key];
  }, []);

  return [setRef, elementsRef] as const;
}
