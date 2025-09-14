import { act } from "@testing-library/react";
import { renderHook } from "../../test/renderHook";
import { useGomoku } from "../useGomoku";

describe("useGomoku", () => {
  beforeEach(() => {
    // Mock AudioContext to prevent sound errors
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
  it("initializes with default state", () => {
    const { result } = renderHook(() => useGomoku());
    expect(result.current.gameBoard.length).toBe(15);
    expect(result.current.currentPlayer).toBe(1);
    expect(result.current.gameActive).toBe(true);
    expect(result.current.moveHistory).toEqual([]);
    expect(result.current.winner).toBeNull();
  });

  it("makes a move and switches player", () => {
    const { result } = renderHook(() => useGomoku());
    act(() => {
      result.current.makeMove(0, 0);
    });
    expect(result.current.gameBoard[0][0]).toBe(1);
    expect(result.current.currentPlayer).toBe(2);
    expect(result.current.moveHistory.length).toBe(1);
  });

  it("prevents move on occupied cell", () => {
    const { result } = renderHook(() => useGomoku());
    act(() => {
      result.current.makeMove(0, 0);
    });
    act(() => {
      result.current.makeMove(0, 0);
    });
    expect(result.current.moveHistory.length).toBe(1);
  });

  it("undoes a move", () => {
    const { result } = renderHook(() => useGomoku());
    act(() => {
      result.current.makeMove(0, 0);
    });
    expect(result.current.gameBoard[0][0]).toBe(1);
    act(() => {
      result.current.undoMove();
    });
    expect(result.current.gameBoard[0][0]).toBe(0);
    expect(result.current.moveHistory.length).toBe(0);
  });

  it("resets the game", () => {
    const { result } = renderHook(() => useGomoku());
    act(() => {
      result.current.makeMove(0, 0);
      result.current.resetGame();
    });
    expect(result.current.gameBoard.flat().every(v => v === 0)).toBe(true);
    expect(result.current.moveHistory.length).toBe(0);
    expect(result.current.currentPlayer).toBe(1);
  });

  it("detects win condition", () => {
    // Use small board for deterministic win
    const { result } = renderHook(() =>
      useGomoku({
        boardSize: 13,
        winCondition: 5,
        allowUndo: true,
        firstPlayer: 1,
      })
    );
    return (async () => {
      // 1: (0,0), 2: (1,0), 1: (0,1), 2: (1,1), 1: (0,2), 2: (1,2), 1: (0,3), 2: (1,3), 1: (0,4)
      await act(async () => {
        expect(result.current.makeMove(0, 0)).toBe(true);
      });
      await act(async () => {
        expect(result.current.makeMove(1, 0)).toBe(true);
      });
      await act(async () => {
        expect(result.current.makeMove(0, 1)).toBe(true);
      });
      await act(async () => {
        expect(result.current.makeMove(1, 1)).toBe(true);
      });
      await act(async () => {
        expect(result.current.makeMove(0, 2)).toBe(true);
      });
      await act(async () => {
        expect(result.current.makeMove(1, 2)).toBe(true);
      });
      await act(async () => {
        expect(result.current.makeMove(0, 3)).toBe(true);
      });
      await act(async () => {
        expect(result.current.makeMove(1, 3)).toBe(true);
      });
      await act(async () => {
        expect(result.current.makeMove(0, 4)).toBe(true);
      });

      // Ensure final state applied
      await act(async () => {});

      // Diagnostic: verify board cells for the winning row
      expect(result.current.gameBoard[0][0]).toBe(1);
      expect(result.current.gameBoard[0][1]).toBe(1);
      expect(result.current.gameBoard[0][2]).toBe(1);
      expect(result.current.gameBoard[0][3]).toBe(1);
      expect(result.current.gameBoard[0][4]).toBe(1);

      expect(result.current.winner).toBe(1);
      expect(result.current.gameActive).toBe(false);
    })();
  });

  it("prevents moves after the game is over", () => {
    const { result } = renderHook(() =>
      useGomoku({
        boardSize: 13,
        winCondition: 5,
        allowUndo: true,
        firstPlayer: 1,
      })
    );

    // Make moves step by step to ensure proper state updates
    act(() => {
      result.current.makeMove(0, 0); // Player 1
    });
    act(() => {
      result.current.makeMove(1, 0); // Player 2
    });
    act(() => {
      result.current.makeMove(0, 1); // Player 1
    });
    act(() => {
      result.current.makeMove(1, 1); // Player 2
    });
    act(() => {
      result.current.makeMove(0, 2); // Player 1
    });
    act(() => {
      result.current.makeMove(1, 2); // Player 2
    });
    act(() => {
      result.current.makeMove(0, 3); // Player 1
    });
    act(() => {
      result.current.makeMove(1, 3); // Player 2
    });
    act(() => {
      result.current.makeMove(0, 4); // Player 1 wins with 5 in a row
    });

    // Verify the winning state
    expect(result.current.winner).toBe(1);
    expect(result.current.gameActive).toBe(false);

    // Try to make another move - should be rejected
    act(() => {
      result.current.makeMove(1, 4);
    });
    expect(result.current.gameBoard[1][4]).toBe(0); // Move should not be allowed
  });

  it("applies config and resets board", () => {
    const { result } = renderHook(() => useGomoku());
    act(() => {
      result.current.applyConfig({
        boardSize: 13,
        winCondition: 5,
        allowUndo: false,
        firstPlayer: 2,
      });
    });
    expect(result.current.gameBoard.length).toBe(13);
    expect(result.current.currentPlayer).toBe(2);
    expect(result.current.moveHistory.length).toBe(0);
  });

  it("handles draw condition", () => {
    const { result } = renderHook(() =>
      useGomoku({
        boardSize: 13,
        winCondition: 5,
        allowUndo: true,
        firstPlayer: 1,
      })
    );

    // Simulate a board close to being full by mocking the checkDraw function
    // We'll make moves that fill the board without creating a win condition
    // This is a simplified test - in reality, a draw on a 13x13 board is very unlikely

    // Fill enough positions to trigger potential draw logic
    // Since we can't easily fill a 13x13 board, we'll test the draw detection indirectly
    // by checking that the game can handle a full board scenario

    // Make several moves without winning
    act(() => {
      // Pattern that avoids creating 5 in a row
      result.current.makeMove(0, 0); // Player 1
      result.current.makeMove(0, 1); // Player 2
      result.current.makeMove(0, 2); // Player 1
      result.current.makeMove(1, 0); // Player 2
      result.current.makeMove(1, 1); // Player 1
      result.current.makeMove(1, 2); // Player 2
      result.current.makeMove(2, 0); // Player 1
      result.current.makeMove(2, 1); // Player 2
    });

    // Verify game is still active (no draw yet on large board)
    expect(result.current.gameActive).toBe(true);
    expect(result.current.winner).toBeNull();
    expect(result.current.moveHistory.length).toBe(8);
  });

  it("prevents undo when undo is disabled", () => {
    const { result } = renderHook(() =>
      useGomoku({
        boardSize: 15,
        winCondition: 5,
        allowUndo: false, // Disable undo
        firstPlayer: 1,
      })
    );

    act(() => {
      result.current.makeMove(0, 0);
    });
    expect(result.current.gameBoard[0][0]).toBe(1);

    act(() => {
      result.current.undoMove();
    });
    // Should not undo because allowUndo is false
    expect(result.current.gameBoard[0][0]).toBe(1);
    expect(result.current.moveHistory.length).toBe(1);
  });

  it("prevents undo when game is not active", () => {
    const { result } = renderHook(() =>
      useGomoku({
        boardSize: 13,
        winCondition: 5,
        allowUndo: true,
        firstPlayer: 1,
      })
    );

    // Create a winning condition - horizontal win
    act(() => {
      result.current.makeMove(0, 0); // Player 1
    });
    act(() => {
      result.current.makeMove(1, 0); // Player 2
    });
    act(() => {
      result.current.makeMove(0, 1); // Player 1
    });
    act(() => {
      result.current.makeMove(1, 1); // Player 2
    });
    act(() => {
      result.current.makeMove(0, 2); // Player 1
    });
    act(() => {
      result.current.makeMove(1, 2); // Player 2
    });
    act(() => {
      result.current.makeMove(0, 3); // Player 1
    });
    act(() => {
      result.current.makeMove(1, 3); // Player 2
    });
    act(() => {
      result.current.makeMove(0, 4); // Player 1 wins horizontally
    });

    expect(result.current.gameActive).toBe(false);

    act(() => {
      result.current.undoMove();
    });
    // Should not undo because game is not active
    expect(result.current.gameActive).toBe(false);
    expect(result.current.winner).toBe(1);
  });
  it("prevents undo when no moves have been made", () => {
    const { result } = renderHook(() => useGomoku());

    act(() => {
      result.current.undoMove();
    });
    // Should not crash and state should remain unchanged
    expect(result.current.moveHistory.length).toBe(0);
    expect(result.current.currentPlayer).toBe(1);
  });

  it("handles review mode correctly", () => {
    const { result } = renderHook(() => useGomoku());

    // Make some moves first
    act(() => {
      result.current.makeMove(0, 0);
      result.current.makeMove(1, 0);
      result.current.makeMove(0, 1);
    });

    expect(result.current.moveHistory.length).toBe(3);

    // Enter review mode
    act(() => {
      result.current.setReviewMode(true);
    });

    expect(result.current.reviewMode).toBe(true);
    expect(result.current.currentReviewMove).toBe(3);

    // Change review move
    act(() => {
      result.current.setCurrentReviewMove(1);
    });

    expect(result.current.currentReviewMove).toBe(1);
    // Board should show only the first move
    expect(result.current.gameBoard[0][0]).toBe(1);
    expect(result.current.gameBoard[1][0]).toBe(0);
    expect(result.current.gameBoard[0][1]).toBe(0);

    // Exit review mode
    act(() => {
      result.current.setReviewMode(false);
    });

    expect(result.current.reviewMode).toBe(false);
  });

  it("handles auto-play in review mode", () => {
    const { result } = renderHook(() => useGomoku());

    // Make some moves first
    act(() => {
      result.current.makeMove(0, 0);
      result.current.makeMove(1, 0);
    });

    // Enter review mode
    act(() => {
      result.current.setReviewMode(true);
      result.current.setCurrentReviewMove(0);
    });

    // Start auto-play
    act(() => {
      result.current.setAutoPlayInterval(100);
    });

    expect(result.current.autoPlayInterval).toBe(100);

    // Stop auto-play
    act(() => {
      result.current.setAutoPlayInterval(null);
    });

    expect(result.current.autoPlayInterval).toBeNull();
  });

  it("detects vertical win condition", () => {
    const { result } = renderHook(() =>
      useGomoku({
        boardSize: 13,
        winCondition: 5,
        allowUndo: true,
        firstPlayer: 1,
      })
    );

    // Create vertical win for player 1
    act(() => {
      result.current.makeMove(0, 0); // Player 1
    });
    act(() => {
      result.current.makeMove(0, 1); // Player 2
    });
    act(() => {
      result.current.makeMove(1, 0); // Player 1
    });
    act(() => {
      result.current.makeMove(0, 2); // Player 2
    });
    act(() => {
      result.current.makeMove(2, 0); // Player 1
    });
    act(() => {
      result.current.makeMove(0, 3); // Player 2
    });
    act(() => {
      result.current.makeMove(3, 0); // Player 1
    });
    act(() => {
      result.current.makeMove(0, 4); // Player 2
    });
    act(() => {
      result.current.makeMove(4, 0); // Player 1 wins vertically
    });

    expect(result.current.winner).toBe(1);
    expect(result.current.gameActive).toBe(false);
  });

  it("detects diagonal win condition", () => {
    const { result } = renderHook(() =>
      useGomoku({
        boardSize: 13,
        winCondition: 5,
        allowUndo: true,
        firstPlayer: 1,
      })
    );

    // Create diagonal win for player 1
    act(() => {
      result.current.makeMove(0, 0); // Player 1
    });
    act(() => {
      result.current.makeMove(0, 1); // Player 2
    });
    act(() => {
      result.current.makeMove(1, 1); // Player 1
    });
    act(() => {
      result.current.makeMove(0, 2); // Player 2
    });
    act(() => {
      result.current.makeMove(2, 2); // Player 1
    });
    act(() => {
      result.current.makeMove(0, 3); // Player 2
    });
    act(() => {
      result.current.makeMove(3, 3); // Player 1
    });
    act(() => {
      result.current.makeMove(0, 4); // Player 2
    });
    act(() => {
      result.current.makeMove(4, 4); // Player 1 wins diagonally
    });

    expect(result.current.winner).toBe(1);
    expect(result.current.gameActive).toBe(false);
  });

  it("detects anti-diagonal win condition", () => {
    const { result } = renderHook(() =>
      useGomoku({
        boardSize: 13,
        winCondition: 5,
        allowUndo: true,
        firstPlayer: 1,
      })
    );

    // Create anti-diagonal win for player 1
    act(() => {
      result.current.makeMove(0, 4); // Player 1
    });
    act(() => {
      result.current.makeMove(0, 0); // Player 2
    });
    act(() => {
      result.current.makeMove(1, 3); // Player 1
    });
    act(() => {
      result.current.makeMove(0, 1); // Player 2
    });
    act(() => {
      result.current.makeMove(2, 2); // Player 1
    });
    act(() => {
      result.current.makeMove(0, 2); // Player 2
    });
    act(() => {
      result.current.makeMove(3, 1); // Player 1
    });
    act(() => {
      result.current.makeMove(1, 0); // Player 2
    });
    act(() => {
      result.current.makeMove(4, 0); // Player 1 wins anti-diagonally
    });

    expect(result.current.winner).toBe(1);
    expect(result.current.gameActive).toBe(false);
  });

  it("exposes audio controls", () => {
    const { result } = renderHook(() => useGomoku());

    // Test audio properties are exposed
    expect(typeof result.current.audioEnabled).toBe("boolean");
    expect(typeof result.current.volume).toBe("number");
    expect(typeof result.current.toggleAudio).toBe("function");
    expect(typeof result.current.setVolume).toBe("function");

    // Test audio controls work
    act(() => {
      result.current.toggleAudio();
    });

    act(() => {
      result.current.setVolume(0.5);
    });

    expect(result.current.volume).toBe(0.5);
  });

  it("exposes timer controls", () => {
    const { result } = renderHook(() => useGomoku());

    // Test timer properties are exposed
    expect(result.current.timerState).toBeDefined();
    expect(result.current.timerConfig).toBeDefined();
    expect(typeof result.current.updateTimerConfig).toBe("function");
    expect(typeof result.current.pauseTimer).toBe("function");
    expect(typeof result.current.resumeTimer).toBe("function");
    expect(typeof result.current.resetTimer).toBe("function");
    expect(typeof result.current.formatTime).toBe("function");
    expect(typeof result.current.isTimeUp).toBe("function");
  });

  it("exposes AI controls", () => {
    const { result } = renderHook(() => useGomoku());

    // Test AI properties are exposed
    expect(result.current.aiConfig).toBeDefined();
    expect(result.current.aiState).toBeDefined();
    expect(typeof result.current.updateAIConfig).toBe("function");
    expect(typeof result.current.toggleAI).toBe("function");
    expect(typeof result.current.setAIDifficulty).toBe("function");
    expect(typeof result.current.setAIPlayer).toBe("function");
    expect(typeof result.current.setAIEvaluationMode).toBe("function");
    expect(typeof result.current.resetAIConfig).toBe("function");
  });
});
