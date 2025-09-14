import React from "react";
import { createRoot, Root } from "react-dom/client";
import { act } from "react-dom/test-utils";

export function renderHook<T>(hook: () => T) {
  const result: { current?: T } = {};

  function Test() {
    const res = hook();
    // store latest
    // @ts-ignore
    result.current = res;
    return null;
  }

  const container = document.createElement("div");
  document.body.appendChild(container);
  const root: Root = createRoot(container);
  // ensure updates are flushed synchronously
  act(() => {
    root.render(React.createElement(Test));
  });
  const unmount = () => {
    try {
      act(() => root.unmount());
    } catch {
      /* ignore */
    }
    if (container.parentNode) container.parentNode.removeChild(container);
  };

  // register unmount globally so setup can cleanup between tests
  const globalKey = "__renderHookUnmounts" as any;
  const g = globalThis as any;
  if (!g[globalKey]) g[globalKey] = [];
  g[globalKey].push(unmount);

  return {
    result: result as { current: T },
    unmount,
  };
}
