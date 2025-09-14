import {
  generateColumnLabels,
  generateRowLabels,
  getCellSizeUtil,
} from "../../utils/GameBoardUtils";

describe("GameBoard Utility Functions", () => {
  test("generateColumnLabels returns correct labels for size 5", () => {
    const labels = generateColumnLabels(5);
    expect(labels).toEqual(["A", "B", "C", "D", "E"]);
  });

  test("generateRowLabels returns correct labels for size 7", () => {
    const labels = generateRowLabels(7);
    expect(labels).toEqual(["1", "2", "3", "4", "5", "6", "7"]);
  });

  test("getCellSizeUtil calculates correctly when width half is smaller", () => {
    // width*0.5=100, height*0.6=120, so containerSize=100
    const size = getCellSizeUtil(4, 200, 200);
    expect(size).toBeCloseTo(100 / 5);
  });

  test("getCellSizeUtil calculates correctly when height portion is smaller", () => {
    // width*0.5=200, height*0.6=60, so containerSize=60
    const size = getCellSizeUtil(2, 400, 100);
    expect(size).toBeCloseTo(60 / 3);
  });
});
