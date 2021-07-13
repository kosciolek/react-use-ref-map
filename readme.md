# react-use-ref-map

## Install

npm

```
npm install react-use-ref-map
```

Yarn

```
yarn add react-use-ref-map
```

## Rationale

Currently, it is possible to:

- Keep a variable amount of refs inside a single `useRef`, without being _easily_ informed when and which ref is added or removed.
  - For example, `useClickAwayListener` - we might want to ignore multiple refs whose amount changes over rerenders, but we don't need to know about their mounts/unmounts (the listener is attached to the window/document).
- Keep a non-variable amount of refs by using the callback form of a ref (`useCallback` instead of `useRef`). _Due to Rules of Hooks, `useCallback` may not be called a variable amount of times._
  - For example, `useIntersectionObserver` - we are interested in only one ref and we want to know when it mounts/mounts, so `useCallback` is ideal.

However, it is not possible to concisely keep a variable amount of refs **and** be informed of their addition or removal, while also keeping functions' identities [to preserve memoization](https://reactjs.org/docs/refs-and-the-dom.html#caveats-with-callback-refs).

Take `useMouseLeaveListener` for an example - a hook that tells when the user leaves an area. The area might be complex, consisting of multiple root elements.

- The amount of parents might be variable (nested popups and so on).
- You want to be aware when any of them mounts/unmounts, so `mouseleave` listeners are added and removed accordingly.

## Usage

Variable amount of refs:

```tsx
function Component() {
  /* State may change over renders. */
  const [state, setState] = useState(["A", "B", "C", "D"]);
  const [setRef, refs] = useRefMap();

  return (
    <>
      {state.map((letter) => (
        <div key={letter} ref={setRef(letter)}>
          {letter}
        </div>
      ))}
    </>
  );
}
```

Variable amount of refs, listen to mounts/mounts:

```tsx
function Component() {
  const [state, setState] = useState(["A", "B", "C", "D"]);

  const [addRef, refs] = useRefMap({
    onEnter: (key, element, refs) => {
      element.addEventListener("mouseleave", listener);
    },
    onLeave: (key, element, refs) => {
      element.removeEventListener("mouseleave", listener);

      if (!Object.values(refs.current).length) console.log("Refs are empty!");
    },
  });

  return (
    <>
      {state.map((letter) => (
        <div key={letter} ref={setRef(letter)}>
          {letter}
        </div>
      ))}
    </>
  );
}
```

Though less useful, non-variable amount of refs

```tsx
function Component() {
  const [setRef, refs] = useRefMap();

  console.log(refs.current["outer"]); // HTMLDivElement

  return (
    <div ref={setRef("outer")}>
      <div ref={setRef("inner1")} />
      <div ref={setRef("inner2")} />
    </div>
  );
}
```
