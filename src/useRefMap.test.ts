import { renderHook } from "@testing-library/react-hooks";
import { useRefMap } from "./useRefMap";
import fn = jest.fn;

let htmlElements: Record<"A" | "B" | "C" | "D", HTMLElement>;

beforeEach(() => {
  htmlElements = {
    A: {},
    B: {},
    C: {},
    D: {},
  } as any;
});

test("keeps function identity for the same id across renders", () => {
  const { rerender, result } = renderHook(() => useRefMap());
  const [setRefs] = result.current;

  const funcA1 = setRefs(0);
  const funcB1 = setRefs(1);

  rerender();

  const funcA2 = setRefs(0);
  const funcB2 = setRefs(1);

  expect(funcA1).toBe(funcA2);
  expect(funcB1).toBe(funcB2);
});

test("calls onEnter", () => {
  const mock = fn();
  const { result } = renderHook(() =>
    useRefMap({
      onEnter: (key, element) => mock(key, element),
    })
  );

  const [setRef] = result.current;
  const id = 0;
  const htmlElem = htmlElements.A;
  setRef(id)(htmlElem);

  expect(mock.mock.calls.length).toBe(1);
  expect(mock.mock.calls[0][0]).toBe(id);
  expect(mock.mock.calls[0][1]).toBe(htmlElem);
});

test("calls onLeave", () => {
  const mock = fn();
  const { result } = renderHook(() =>
    useRefMap({
      onLeave: (key, element) => mock(key, element),
    })
  );

  const [setRef] = result.current;
  const id = 0;
  const htmlElem = htmlElements.A;
  setRef(id)(htmlElem);
  setRef(id)(null);

  expect(mock.mock.calls.length).toBe(1);
  expect(mock.mock.calls[0][0]).toBe(id);
  expect(mock.mock.calls[0][1]).toBe(null);
});

test("calls onChange", () => {
  const mock = fn();
  const { result } = renderHook(() =>
    useRefMap({
      onChange: (key, element) => mock(key, element),
    })
  );

  const [setRef] = result.current;
  const id = 0;
  const htmlElem = htmlElements.A;
  setRef(id)(htmlElem);
  setRef(id)(null);

  expect(mock.mock.calls.length).toBe(2);

  expect(mock.mock.calls[0][0]).toBe(id);
  expect(mock.mock.calls[0][1]).toBe(htmlElem);

  expect(mock.mock.calls[1][0]).toBe(id);
  expect(mock.mock.calls[1][1]).toBe(null);
});

test("deletes elements", () => {
  const { result } = renderHook(() => useRefMap({}));

  const [setRef, refs] = result.current;

  const id = 0;
  const htmlElem = htmlElements.A;
  setRef(id)(htmlElem);
  setRef(id)(null);

  expect(Object.keys(refs.current).length).toBe(0);
});
