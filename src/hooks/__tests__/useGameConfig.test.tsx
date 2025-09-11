import { act } from "@testing-library/react";
import { renderHook } from "../../test/renderHook";
import { useGameConfig } from "../useGameConfig";

describe("useGameConfig", () => {
  let wrapper: any = null;
  beforeEach(() => {
    localStorage.clear();
    wrapper = null;
  });
  afterEach(() => {
    if (wrapper && typeof wrapper.unmount === "function") wrapper.unmount();
  });

  it("initializes with default config", () => {
    wrapper = renderHook(() => useGameConfig());
    const { result } = wrapper;
    expect(result.current.config.boardSize).toBe(15);
    expect(result.current.config.winCondition).toBe(5);
    expect(result.current.config.firstPlayer).toBe(1);
    expect(result.current.config.allowUndo).toBe(true);
  });

  it("updates configuration correctly", () => {
    wrapper = renderHook(() => useGameConfig());
    const { result } = wrapper;
    act(() => {
      result.current.updateConfig({ boardSize: 19, winCondition: 6 });
    });
    expect(result.current.config.boardSize).toBe(19);
    expect(result.current.config.winCondition).toBe(6);
  });

  it("resets configuration to default", () => {
    wrapper = renderHook(() => useGameConfig());
    const { result } = wrapper;
    act(() => {
      result.current.updateConfig({ boardSize: 13 });
    });
    expect(result.current.config.boardSize).toBe(13);
    act(() => {
      result.current.resetConfig();
    });
    expect(result.current.config).toEqual({
      boardSize: 15,
      winCondition: 5,
      firstPlayer: 1,
      allowUndo: true,
    });
  });

  it("sets board size", () => {
    wrapper = renderHook(() => useGameConfig());
    const { result } = wrapper;
    act(() => {
      result.current.setBoardSize(13);
    });
    expect(result.current.config.boardSize).toBe(13);
  });

  it("sets win condition", () => {
    wrapper = renderHook(() => useGameConfig());
    const { result } = wrapper;
    act(() => {
      result.current.setWinCondition(4);
    });
    expect(result.current.config.winCondition).toBe(4);
  });

  it("sets first player", () => {
    wrapper = renderHook(() => useGameConfig());
    const { result } = wrapper;
    act(() => {
      result.current.setFirstPlayer(2);
    });
    expect(result.current.config.firstPlayer).toBe(2);
  });

  it("sets allow undo", () => {
    wrapper = renderHook(() => useGameConfig());
    const { result } = wrapper;
    act(() => {
      result.current.setAllowUndo(false);
    });
    expect(result.current.config.allowUndo).toBe(false);
  });
});
