import { act } from "@testing-library/react";
import { useAudioSystem } from "../useAudioSystem";
import { renderHook } from "../../test/renderHook";
import { vi } from "vitest";

describe("useAudioSystem", () => {
  beforeEach(() => {
    localStorage.clear();
    // provide a fake AudioContext
    (window as any).AudioContext = class {
      state = "running";
      currentTime = 0;
      createOscillator() {
        return {
          connect() {},
          frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
          start() {},
          stop() {},
        };
      }
      createGain() {
        return {
          connect() {},
          gain: {
            setValueAtTime() {},
            linearRampToValueAtTime() {},
            exponentialRampToValueAtTime() {},
          },
        };
      }
      resume() {
        this.state = "running";
      }
    };
  });

  let wrapper: any = null;
  afterEach(() => {
    if (wrapper && typeof wrapper.unmount === "function") wrapper.unmount();
  });

  it("toggles audio and sets volume", () => {
    wrapper = renderHook(() => useAudioSystem());
    const { result } = wrapper;
    expect(result.current.audioEnabled).toBe(true);
    act(() => result.current.toggleAudio());
    expect(result.current.audioEnabled).toBe(false);
    act(() => result.current.setVolume(0.9));
    expect(result.current.volume).toBeCloseTo(0.9);
  });

  it("setVolume clamps value between 0 and 1", () => {
    wrapper = renderHook(() => useAudioSystem());
    const { result } = wrapper;
    act(() => result.current.setVolume(-1));
    expect(result.current.volume).toBe(0);
    act(() => result.current.setVolume(2));
    expect(result.current.volume).toBe(1);
  });

  it("playMoveSound does nothing if audio is disabled", () => {
    wrapper = renderHook(() => useAudioSystem());
    const { result } = wrapper;
    act(() => result.current.toggleAudio());
    expect(result.current.audioEnabled).toBe(false);
    // Should not throw
    act(() => {
      result.current.playMoveSound();
    });
  });

  it("playMoveSound runs without error when enabled", () => {
    wrapper = renderHook(() => useAudioSystem());
    const { result } = wrapper;
    act(() => {
      result.current.playMoveSound();
    });
  });

  it("playWinSound does nothing if audio is disabled", () => {
    wrapper = renderHook(() => useAudioSystem());
    const { result } = wrapper;
    act(() => result.current.toggleAudio());
    expect(result.current.audioEnabled).toBe(false);
    // Should not throw
    act(() => {
      result.current.playWinSound();
    });
  });

  it("playWinSound runs without error when enabled", () => {
    wrapper = renderHook(() => useAudioSystem());
    const { result } = wrapper;
    act(() => {
      result.current.playWinSound();
    });
  });

  it("persists config to localStorage", () => {
    wrapper = renderHook(() => useAudioSystem());
    const { result } = wrapper;
    act(() => result.current.setVolume(0.5));
    const stored = localStorage.getItem("gomoku-audio-config");
    expect(stored).toContain("0.5");
  });

  it("playMoveSound handles errors gracefully", () => {
    const localWrapper = renderHook(() => useAudioSystem());
    const { result } = localWrapper;
    // 模拟 initAudioContext 抛错
    const original = (window as any).AudioContext;
    (window as any).AudioContext = undefined;
    // 捕获 console.warn
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(() => {
      act(() => {
        result.current.playMoveSound();
      });
    }).not.toThrow();
    spy.mockRestore();
    (window as any).AudioContext = original;
  });

  it("playWinSound handles errors gracefully", () => {
    const localWrapper = renderHook(() => useAudioSystem());
    const { result } = localWrapper;
    // 模拟 initAudioContext 抛错
    const original = (window as any).AudioContext;
    (window as any).AudioContext = undefined;
    // 捕获 console.warn
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(() => {
      act(() => {
        result.current.playWinSound();
      });
    }).not.toThrow();
    spy.mockRestore();
    (window as any).AudioContext = original;
  });
});
