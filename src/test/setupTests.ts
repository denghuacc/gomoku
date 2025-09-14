// Global test setup for Vitest
// Cleans up any renderHook mounts created by src/test/renderHook.tsx
import { afterEach } from "vitest";

const globalKey = "__renderHookUnmounts" as any;
const g = globalThis as any;

afterEach(() => {
  if (g[globalKey] && Array.isArray(g[globalKey])) {
    while (g[globalKey].length) {
      const fn = g[globalKey].pop();
      try {
        fn();
      } catch {
        // ignore
      }
    }
  }
});
