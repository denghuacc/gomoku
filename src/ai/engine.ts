import { Player, GameBoard, Move } from '../hooks/useGomoku';
import { AIConfig, EvaluationResult } from './types';

/**
 * AI 引擎类
 * 实现基于 Minimax 算法的五子棋 AI
 */
export class GomokuAI {
  private config: AIConfig;
  private boardSize: number;
  private winCondition: number;

  constructor(config: AIConfig, boardSize: number, winCondition: number) {
    this.config = config;
    this.boardSize = boardSize;
    this.winCondition = winCondition;
  }

  /**
   * 获取 AI 的最佳落子位置
   */
  public async getBestMove(
    board: GameBoard,
    currentPlayer: Player
  ): Promise<Move | null> {
    console.log(
      `[AI] 开始计算最佳移动，难度: ${this.config.difficulty}, 玩家: ${currentPlayer}`
    );

    // 模拟思考时间
    await this.simulateThinking();

    let result: Move | null = null;

    // 添加超时保护
    const startTime = Date.now();

    try {
      // 根据难度选择不同的策略
      switch (this.config.difficulty) {
        case 'easy':
          result = this.getEasyMove(board, currentPlayer);
          break;
        case 'medium':
          result = this.getMediumMove(board, currentPlayer);
          break;
        case 'hard':
          result = this.getHardMoveWithTimeout(board, currentPlayer);
          break;
        default:
          result = this.getEasyMove(board, currentPlayer);
          break;
      }
    } catch (error) {
      console.error('[AI] 计算出错，使用备用策略:', error);
      result = this.getBackupMove(board, currentPlayer);
    }

    const calculationTime = Date.now() - startTime;
    console.log(
      `[AI] 计算完成，选择位置:`,
      result,
      `计算时间: ${calculationTime}ms`
    );

    // 如果没有找到合适的位置，使用备用策略
    if (!result) {
      result = this.getBackupMove(board, currentPlayer);
    }

    return result;
  }

  /**
   * 简单难度：主要随机落子，偶尔阻挡对手
   */
  private getEasyMove(board: GameBoard, player: Player): Move | null {
    const emptyCells = this.getEmptyCells(board);
    if (emptyCells.length === 0) return null;

    // 30% 概率进行基础策略判断
    if (Math.random() < 0.3) {
      // 检查是否能立即获胜
      const winMove = this.findWinningMove(board, player);
      if (winMove) return winMove;

      // 检查是否需要阻挡对手获胜
      const opponent = player === 1 ? 2 : 1;
      const blockMove = this.findWinningMove(board, opponent);
      if (blockMove) return blockMove;
    }

    // 70% 概率随机落子
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  }

  /**
   * 中等难度：基础策略 + 简单评估（支持战术风格）
   */
  private getMediumMove(board: GameBoard, player: Player): Move | null {
    return this.getTacticalMove(board, player, false);
  }

  /**
   * 困难模式带超时保护的落子（支持战术风格）
   */
  private getHardMoveWithTimeout(board: GameBoard, player: Player): Move {
    const startTime = Date.now();

    try {
      const move = this.getTacticalMove(board, player, true);
      const elapsedTime = Date.now() - startTime;
      console.log(`[AI Hard] 计算完成，耗时: ${elapsedTime}ms`);
      return move || this.getBackupMove(board, player);
    } catch {
      console.warn(`[AI Hard] 计算超时或出错，使用备用方案`);
      return this.getBackupMove(board, player);
    }
  }

  /**
   * 基于战术风格的智能落子
   */
  private getTacticalMove(
    board: GameBoard,
    player: Player,
    useDeepSearch: boolean
  ): Move | null {
    const opponent = player === 1 ? 2 : 1;
    const mode = this.config.evaluationMode;

    // 获胜机会检查（所有模式都优先考虑）
    const winMove = this.findWinningMove(board, player);
    if (winMove) {
      console.log(`[AI ${mode}] 找到获胜位置:`, winMove);
      return winMove;
    }

    // 根据战术风格调整优先级
    switch (mode) {
      case 'offensive':
        // 进攻型：优先进攻，后考虑防守
        return this.getOffensiveMove(board, player, opponent, useDeepSearch);

      case 'defensive':
        // 防守型：优先防守，后考虑进攻
        return this.getDefensiveMove(board, player, opponent, useDeepSearch);

      case 'balanced':
      default:
        // 平衡型：平衡考虑攻守
        return this.getBalancedMove(board, player, opponent, useDeepSearch);
    }
  }

  /**
   * 进攻型战术
   */
  private getOffensiveMove(
    board: GameBoard,
    player: Player,
    opponent: Player,
    useDeepSearch: boolean
  ): Move | null {
    console.log(`[AI Offensive] 执行进攻型战术`);

    // 1. 寻找能形成多重威胁的位置
    const threatMove = this.findMultipleThreatMove(board, player);
    if (threatMove) {
      console.log(`[AI Offensive] 找到多重威胁位置:`, threatMove);
      return threatMove;
    }

    // 2. 次要考虑：阻止对手的致命威胁
    const criticalBlockMove = this.findCriticalDefenseMove(board, opponent);
    if (criticalBlockMove) {
      console.log(`[AI Offensive] 必须防守关键位置:`, criticalBlockMove);
      return criticalBlockMove;
    }

    // 3. 使用评估函数（进攻权重更高）
    return useDeepSearch
      ? this.getBestMoveByMinimax(board, player)
      : this.getBestMoveByEvaluation(board, player, 3);
  }

  /**
   * 防守型战术
   */
  private getDefensiveMove(
    board: GameBoard,
    player: Player,
    opponent: Player,
    useDeepSearch: boolean
  ): Move | null {
    console.log(`[AI Defensive] 执行防守型战术`);

    // 1. 优先阻止对手获胜
    const blockMove = this.findWinningMove(board, opponent);
    if (blockMove) {
      console.log(`[AI Defensive] 阻止对手获胜:`, blockMove);
      return blockMove;
    }

    // 2. 寻找阻止对手形成威胁的位置
    const preventThreatMove = this.findPreventThreatMove(board, opponent);
    if (preventThreatMove) {
      console.log(`[AI Defensive] 阻止对手威胁:`, preventThreatMove);
      return preventThreatMove;
    }

    // 3. 在防守基础上寻找进攻机会
    return useDeepSearch
      ? this.getBestMoveByMinimax(board, player)
      : this.getBestMoveByEvaluation(board, player, 2);
  }

  /**
   * 平衡型战术
   */
  private getBalancedMove(
    board: GameBoard,
    player: Player,
    opponent: Player,
    useDeepSearch: boolean
  ): Move | null {
    console.log(`[AI Balanced] 执行平衡型战术`);

    // 1. 防守关键威胁
    const blockMove = this.findWinningMove(board, opponent);
    if (blockMove) {
      console.log(`[AI Balanced] 防守关键位置:`, blockMove);
      return blockMove;
    }

    // 2. 寻找最佳平衡位置（攻守兼备）
    return useDeepSearch
      ? this.getBestMoveByMinimax(board, player)
      : this.getBestMoveByEvaluation(board, player, 2);
  }

  /**
   * 备用落子方案（快速评估）
   */
  private getBackupMove(board: GameBoard, player: Player): Move {
    console.log(`[AI Hard] 使用备用落子方案`);

    // 尝试查找获胜落子
    const winMove = this.findWinningMove(board, player);
    if (winMove) return winMove;

    // 尝试阻止对手获胜
    const blockMove = this.findWinningMove(board, player === 1 ? 2 : 1);
    if (blockMove) return blockMove;

    // 使用基础评估选择最佳位置
    const emptyCells = this.getMeaningfulEmptyCells(board);
    let bestMove = emptyCells[0];
    let bestScore = -Infinity;

    for (const cell of emptyCells.slice(0, 10)) {
      // 只评估前10个位置
      const newBoard = board.map(row => [...row]);
      newBoard[cell.row][cell.col] = player;
      const score = this.evaluatePosition(newBoard, player);
      if (score > bestScore) {
        bestScore = score;
        bestMove = cell;
      }
    }

    return { ...bestMove, player };
  }

  /**
   * 查找获胜落子位置
   */
  private findWinningMove(board: GameBoard, player: Player): Move | null {
    const emptyCells = this.getEmptyCells(board);

    for (const cell of emptyCells) {
      // 尝试在该位置落子
      const testBoard = this.copyBoard(board);
      testBoard[cell.row][cell.col] = player;

      // 检查是否获胜
      if (this.checkWin(testBoard, cell.row, cell.col, player)) {
        return cell;
      }
    }

    return null;
  }

  /**
   * 基于评估函数获取最佳移动
   */
  private getBestMoveByEvaluation(
    board: GameBoard,
    player: Player,
    _depth: number
  ): Move | null {
    const emptyCells = this.getMeaningfulEmptyCells(board);
    if (emptyCells.length === 0) return null;

    console.log(`[AI Evaluation] 评估 ${emptyCells.length} 个候选位置`);

    let bestScore = -Infinity;
    let bestMove: Move | null = null;

    for (const cell of emptyCells) {
      const testBoard = this.copyBoard(board);
      testBoard[cell.row][cell.col] = player;

      const score = this.evaluatePosition(testBoard, player);
      if (score > bestScore) {
        bestScore = score;
        bestMove = cell;
      }
    }

    console.log(`[AI Evaluation] 最佳位置:`, bestMove, `分数: ${bestScore}`);
    return bestMove;
  }

  /**
   * 使用 Minimax 算法获取最佳移动（高性能版本）
   */
  private getBestMoveByMinimax(board: GameBoard, player: Player): Move | null {
    const startTime = Date.now();
    const maxTime = Math.min(this.config.thinkingTime, 1000); // 最多1秒

    console.log(`[AI Minimax] 开始计算，最大时间: ${maxTime}ms`);

    // 迭代加深搜索：从深度1开始，逐步增加到目标深度
    let bestMove: Move | null = null;
    let currentDepth = 1;
    const maxDepth = this.config.maxDepth;

    while (currentDepth <= maxDepth && Date.now() - startTime < maxTime * 0.8) {
      console.log(`[AI Minimax] 搜索深度: ${currentDepth}`);

      const result = this.minimaxWithTimeLimit(
        board,
        currentDepth,
        -Infinity,
        Infinity,
        true,
        player,
        startTime,
        maxTime
      );

      if (result.bestMove) {
        bestMove = result.bestMove;
        console.log(
          `[AI Minimax] 深度 ${currentDepth} 完成，最佳移动:`,
          bestMove,
          `分数: ${result.score}`
        );
      }

      // 如果找到必胜/必败局面，提前结束
      if (Math.abs(result.score) > 9000) {
        console.log(`[AI Minimax] 找到决定性局面，提前结束`);
        break;
      }

      currentDepth++;
    }

    const elapsedTime = Date.now() - startTime;
    console.log(
      `[AI Minimax] 搜索完成，耗时: ${elapsedTime}ms，最终深度: ${
        currentDepth - 1
      }`
    );

    return bestMove;
  }

  /**
   * 带时间限制的 Minimax 算法
   */
  private minimaxWithTimeLimit(
    board: GameBoard,
    depth: number,
    alpha: number,
    beta: number,
    maximizing: boolean,
    player: Player,
    startTime: number,
    maxTime: number
  ): EvaluationResult {
    // 时间检查
    if (Date.now() - startTime > maxTime * 0.9) {
      return {
        score: this.evaluatePosition(board, player),
        bestMove: null,
        depth: depth,
        evaluatedNodes: 1,
      };
    }

    // 深度检查
    if (depth === 0) {
      return {
        score: this.evaluatePosition(board, player),
        bestMove: null,
        depth: depth,
        evaluatedNodes: 1,
      };
    }

    // 获取排序后的候选移动（只取最有希望的位置）
    const candidateMoves = this.getSortedCandidateMoves(board, player, depth);

    if (candidateMoves.length === 0) {
      return {
        score: 0,
        bestMove: null,
        depth: depth,
        evaluatedNodes: 1,
      };
    }

    let bestMove: Move | null = null;
    let evaluatedNodes = 0;

    if (maximizing) {
      let maxScore = -Infinity;

      for (const cell of candidateMoves) {
        const testBoard = this.copyBoard(board);
        testBoard[cell.row][cell.col] = player;

        // 立即获胜检查
        if (this.checkWin(testBoard, cell.row, cell.col, player)) {
          return {
            score: 10000 + depth,
            bestMove: cell,
            depth: depth,
            evaluatedNodes: 1,
          };
        }

        const result = this.minimaxWithTimeLimit(
          testBoard,
          depth - 1,
          alpha,
          beta,
          false,
          player,
          startTime,
          maxTime
        );

        evaluatedNodes += result.evaluatedNodes;

        if (result.score > maxScore) {
          maxScore = result.score;
          bestMove = cell;
        }

        alpha = Math.max(alpha, result.score);
        if (beta <= alpha) {
          break; // Alpha-Beta 剪枝
        }

        // 时间检查
        if (Date.now() - startTime > maxTime * 0.9) {
          break;
        }
      }

      return {
        score: maxScore,
        bestMove: bestMove,
        depth: depth,
        evaluatedNodes: evaluatedNodes,
      };
    } else {
      let minScore = Infinity;
      const opponent = player === 1 ? 2 : 1;

      for (const cell of candidateMoves) {
        const testBoard = this.copyBoard(board);
        testBoard[cell.row][cell.col] = opponent;

        // 对手立即获胜检查
        if (this.checkWin(testBoard, cell.row, cell.col, opponent)) {
          return {
            score: -10000 - depth,
            bestMove: cell,
            depth: depth,
            evaluatedNodes: 1,
          };
        }

        const result = this.minimaxWithTimeLimit(
          testBoard,
          depth - 1,
          alpha,
          beta,
          true,
          player,
          startTime,
          maxTime
        );

        evaluatedNodes += result.evaluatedNodes;

        if (result.score < minScore) {
          minScore = result.score;
          bestMove = cell;
        }

        beta = Math.min(beta, result.score);
        if (beta <= alpha) {
          break; // Alpha-Beta 剪枝
        }

        // 时间检查
        if (Date.now() - startTime > maxTime * 0.9) {
          break;
        }
      }

      return {
        score: minScore,
        bestMove: bestMove,
        depth: depth,
        evaluatedNodes: evaluatedNodes,
      };
    }
  }

  /**
   * 获取排序后的候选移动（移动排序优化）
   */
  private getSortedCandidateMoves(
    board: GameBoard,
    player: Player,
    depth: number
  ): Move[] {
    const emptyCells = this.getMeaningfulEmptyCells(board);

    // 根据深度限制候选数量
    const maxCandidates = depth >= 3 ? 8 : depth >= 2 ? 12 : 16;

    if (emptyCells.length <= maxCandidates) {
      return this.sortMovesByPriority(emptyCells, board, player);
    }

    // 快速评估所有位置并排序
    const scoredMoves = emptyCells.map(cell => {
      const testBoard = this.copyBoard(board);
      testBoard[cell.row][cell.col] = player;

      // 简化评估：只检查直接威胁和防御
      let score = 0;

      // 检查是否能获胜
      if (this.checkWin(testBoard, cell.row, cell.col, player)) {
        score += 10000;
      }

      // 检查是否阻止对手获胜
      const opponent = player === 1 ? 2 : 1;
      const opponentBoard = this.copyBoard(board);
      opponentBoard[cell.row][cell.col] = opponent;
      if (this.checkWin(opponentBoard, cell.row, cell.col, opponent)) {
        score += 5000;
      }

      // 简单位置评估
      score += this.getPositionValue(cell.row, cell.col, board);

      return { cell, score };
    });

    // 按分数排序，取前N个
    scoredMoves.sort((a, b) => b.score - a.score);
    return scoredMoves.slice(0, maxCandidates).map(item => item.cell);
  }

  /**
   * 移动优先级排序
   */
  private sortMovesByPriority(
    moves: Move[],
    board: GameBoard,
    player: Player
  ): Move[] {
    const opponent = player === 1 ? 2 : 1;

    const prioritized = moves.map(cell => {
      let priority = 0;

      // 测试该位置
      const testBoard = this.copyBoard(board);
      testBoard[cell.row][cell.col] = player;

      // 最高优先级：获胜
      if (this.checkWin(testBoard, cell.row, cell.col, player)) {
        priority += 1000000;
      }

      // 高优先级：阻止对手获胜
      const opponentBoard = this.copyBoard(board);
      opponentBoard[cell.row][cell.col] = opponent;
      if (this.checkWin(opponentBoard, cell.row, cell.col, opponent)) {
        priority += 500000;
      }

      // 中等优先级：形成威胁
      priority += this.getPositionValue(cell.row, cell.col, board);

      return { cell, priority };
    });

    prioritized.sort((a, b) => b.priority - a.priority);
    return prioritized.map(item => item.cell);
  }

  /**
   * 获取位置价值（简化版）
   */
  private getPositionValue(row: number, col: number, board: GameBoard): number {
    let value = 0;
    const center = Math.floor(this.boardSize / 2);

    // 中心位置更有价值
    const distanceFromCenter = Math.abs(row - center) + Math.abs(col - center);
    value += Math.max(0, 10 - distanceFromCenter);

    // 检查周围是否有棋子（连接性）
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];
    for (const [dx, dy] of directions) {
      for (let i = 1; i <= 2; i++) {
        const newRow = row + i * dx;
        const newCol = col + i * dy;

        if (
          newRow >= 0 &&
          newRow < this.boardSize &&
          newCol >= 0 &&
          newCol < this.boardSize &&
          board[newRow][newCol] !== 0
        ) {
          value += 5 / i; // 距离越近价值越高
        }
      }
    }

    return value;
  }

  /**
   * 评估棋盘位置的分数
   */
  private evaluatePosition(board: GameBoard, player: Player): number {
    let myScore = 0;
    let opponentScore = 0;
    const opponent = player === 1 ? 2 : 1;

    // 评估所有可能的连线
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        // 水平方向
        myScore += this.evaluateLine(board, row, col, 0, 1, player);
        opponentScore += this.evaluateLine(board, row, col, 0, 1, opponent);

        // 垂直方向
        myScore += this.evaluateLine(board, row, col, 1, 0, player);
        opponentScore += this.evaluateLine(board, row, col, 1, 0, opponent);

        // 对角线方向
        myScore += this.evaluateLine(board, row, col, 1, 1, player);
        opponentScore += this.evaluateLine(board, row, col, 1, 1, opponent);

        // 反对角线方向
        myScore += this.evaluateLine(board, row, col, 1, -1, player);
        opponentScore += this.evaluateLine(board, row, col, 1, -1, opponent);
      }
    }

    // 根据评估模式调整权重
    return this.applyTacticalStyle(myScore, opponentScore);
  }

  /**
   * 根据战术风格调整评估分数
   */
  private applyTacticalStyle(myScore: number, opponentScore: number): number {
    const mode = this.config.evaluationMode;

    switch (mode) {
      case 'offensive':
        // 进攻型：优先自己的得分，进攻权重1.3倍，防守权重0.7倍
        return myScore * 1.3 - opponentScore * 0.7;

      case 'defensive':
        // 防守型：优先阻止对手，防守权重1.3倍，进攻权重0.7倍
        return myScore * 0.7 - opponentScore * 1.3;

      case 'balanced':
      default:
        // 平衡型：攻守权重相等
        return myScore - opponentScore;
    }
  }

  /**
   * 评估特定方向的连线分数
   */
  private evaluateLine(
    board: GameBoard,
    row: number,
    col: number,
    deltaRow: number,
    deltaCol: number,
    player: Player
  ): number {
    let count = 0;
    let blocked = 0;

    // 正向计数
    for (let i = 0; i < this.winCondition; i++) {
      const newRow = row + i * deltaRow;
      const newCol = col + i * deltaCol;

      if (
        newRow < 0 ||
        newRow >= this.boardSize ||
        newCol < 0 ||
        newCol >= this.boardSize
      ) {
        blocked++;
        break;
      }

      if (board[newRow][newCol] === player) {
        count++;
      } else if (board[newRow][newCol] !== 0) {
        blocked++;
        break;
      }
    }

    // 如果被完全阻挡，返回 0
    if (blocked >= 2) return 0;

    // 根据连子数量和阻挡情况给分
    const scores = [0, 1, 10, 100, 1000, 10000];
    const baseScore = scores[Math.min(count, scores.length - 1)];

    // 如果有一端被阻挡，分数减半
    return blocked === 1 ? baseScore / 2 : baseScore;
  }

  /**
   * 检查获胜条件
   */
  private checkWin(
    board: GameBoard,
    row: number,
    col: number,
    player: Player
  ): boolean {
    const directions: [number, number][] = [
      [0, 1], // 水平 (行不变，列变化)
      [1, 0], // 垂直 (行变化，列不变)
      [1, 1], // 对角线 (右下)
      [1, -1], // 反对角线 (左下)
    ];

    for (const [dx, dy] of directions) {
      let count = 1; // 当前位置已经有一个棋子

      // 正向检查
      for (let i = 1; i < this.boardSize; i++) {
        const newRow = row + i * dx;
        const newCol = col + i * dy;

        if (
          newRow < 0 ||
          newRow >= this.boardSize ||
          newCol < 0 ||
          newCol >= this.boardSize
        ) {
          break;
        }

        if (board[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }

      // 反向检查
      for (let i = 1; i < this.boardSize; i++) {
        const newRow = row - i * dx;
        const newCol = col - i * dy;

        if (
          newRow < 0 ||
          newRow >= this.boardSize ||
          newCol < 0 ||
          newCol >= this.boardSize
        ) {
          break;
        }

        if (board[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }

      if (count >= this.winCondition) {
        return true;
      }
    }

    return false;
  }

  /**
   * 获取所有空位
   */
  private getEmptyCells(board: GameBoard): Move[] {
    const emptyCells: Move[] = [];

    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (board[row][col] === 0) {
          emptyCells.push({ row, col, player: this.config.player });
        }
      }
    }

    return emptyCells;
  }

  /**
   * 获取有意义的空位（已有棋子附近的位置）
   */
  private getMeaningfulEmptyCells(board: GameBoard): Move[] {
    const moveCount = this.getMoveCount(board);

    // 如果棋盘是空的，返回中心附近的位置
    if (moveCount === 0) {
      const center = Math.floor(this.boardSize / 2);
      return [{ row: center, col: center, player: this.config.player }];
    }

    // 如果棋子很少，返回更小的范围
    if (moveCount <= 2) {
      const center = Math.floor(this.boardSize / 2);
      const centralArea: Move[] = [];
      for (let row = center - 2; row <= center + 2; row++) {
        for (let col = center - 2; col <= center + 2; col++) {
          if (
            row >= 0 &&
            row < this.boardSize &&
            col >= 0 &&
            col < this.boardSize &&
            board[row][col] === 0
          ) {
            centralArea.push({ row, col, player: this.config.player });
          }
        }
      }
      return centralArea;
    }

    const meaningfulCells: Move[] = [];
    // 根据棋子数量动态调整搜索距离
    const distance = moveCount < 8 ? 2 : 1; // 早期搜索范围更大，后期更小

    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (board[row][col] === 0) {
          // 检查周围是否有棋子
          let hasNearbyPiece = false;
          for (let dr = -distance; dr <= distance; dr++) {
            for (let dc = -distance; dc <= distance; dc++) {
              if (dr === 0 && dc === 0) continue; // 跳过自己

              const newRow = row + dr;
              const newCol = col + dc;
              if (
                newRow >= 0 &&
                newRow < this.boardSize &&
                newCol >= 0 &&
                newCol < this.boardSize &&
                board[newRow][newCol] !== 0
              ) {
                hasNearbyPiece = true;
                break;
              }
            }
            if (hasNearbyPiece) break;
          }

          if (hasNearbyPiece) {
            meaningfulCells.push({ row, col, player: this.config.player });
          }
        }
      }
    }

    console.log(
      `[AI] 搜索范围：${meaningfulCells.length} 个候选位置（棋子数：${moveCount}，距离：${distance}）`
    );

    // 如果候选位置太多，进行初步筛选
    if (meaningfulCells.length > 20) {
      return this.filterTopCandidates(meaningfulCells, board, 20);
    }

    // 如果没找到有意义的位置，回退到中心区域
    if (meaningfulCells.length === 0) {
      const center = Math.floor(this.boardSize / 2);
      for (let row = center - 1; row <= center + 1; row++) {
        for (let col = center - 1; col <= center + 1; col++) {
          if (
            row >= 0 &&
            row < this.boardSize &&
            col >= 0 &&
            col < this.boardSize &&
            board[row][col] === 0
          ) {
            meaningfulCells.push({ row, col, player: this.config.player });
          }
        }
      }
    }

    return meaningfulCells;
  }

  /**
   * 筛选最有价值的候选位置
   */
  private filterTopCandidates(
    candidates: Move[],
    board: GameBoard,
    maxCount: number
  ): Move[] {
    const scored = candidates.map(cell => ({
      cell,
      score: this.getPositionValue(cell.row, cell.col, board),
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, maxCount).map(item => item.cell);
  }

  /**
   * 复制棋盘
   */
  private copyBoard(board: GameBoard): GameBoard {
    return board.map(row => [...row]);
  }

  /**
   * 计算棋盘上的落子数量
   */
  private getMoveCount(board: GameBoard): number {
    let count = 0;
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (board[row][col] !== 0) {
          count++;
        }
      }
    }
    return count;
  }

  /**
   * 模拟思考时间
   */
  private async simulateThinking(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, this.config.thinkingTime);
    });
  }

  /**
   * 更新配置
   */
  public updateConfig(newConfig: Partial<AIConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * 更新棋盘大小
   */
  public updateBoardSize(boardSize: number): void {
    this.boardSize = boardSize;
  }

  /**
   * 更新获胜条件
   */
  public updateWinCondition(winCondition: number): void {
    this.winCondition = winCondition;
  }

  /**
   * 寻找能形成多重威胁的位置（进攻型战术）
   */
  private findMultipleThreatMove(
    board: GameBoard,
    player: Player
  ): Move | null {
    const emptyCells = this.getMeaningfulEmptyCells(board);

    for (const cell of emptyCells) {
      const testBoard = this.copyBoard(board);
      testBoard[cell.row][cell.col] = player;

      // 检查这个位置是否能形成多个威胁方向
      let threatCount = 0;
      const directions: [number, number][] = [
        [0, 1], // 水平
        [1, 0], // 垂直
        [1, 1], // 对角线
        [1, -1], // 反对角线
      ];

      for (const [dx, dy] of directions) {
        const lineScore = this.evaluateLine(
          testBoard,
          cell.row,
          cell.col,
          dx,
          dy,
          player
        );
        // 如果这个方向能形成3连或更强威胁（分数 >= 100）
        if (lineScore >= 100) {
          threatCount++;
        }
      }

      // 如果能在2个或更多方向形成威胁，这是一个多重威胁位置
      if (threatCount >= 2) {
        console.log(`[AI] 找到多重威胁位置 (${threatCount} 个威胁方向):`, cell);
        return cell;
      }
    }

    return null;
  }

  /**
   * 寻找关键防守位置（防守对手的致命威胁）
   */
  private findCriticalDefenseMove(
    board: GameBoard,
    opponent: Player
  ): Move | null {
    const emptyCells = this.getMeaningfulEmptyCells(board);

    for (const cell of emptyCells) {
      const testBoard = this.copyBoard(board);
      testBoard[cell.row][cell.col] = opponent;

      // 检查对手在这个位置是否能形成4连（即下一步就能获胜）
      const directions: [number, number][] = [
        [0, 1], // 水平
        [1, 0], // 垂直
        [1, 1], // 对角线
        [1, -1], // 反对角线
      ];

      for (const [dx, dy] of directions) {
        const lineScore = this.evaluateLine(
          testBoard,
          cell.row,
          cell.col,
          dx,
          dy,
          opponent
        );
        // 如果对手能形成4连（分数 >= 1000），这是关键防守位置
        if (lineScore >= 1000) {
          console.log(`[AI] 找到关键防守位置:`, cell);
          return cell;
        }
      }
    }

    return null;
  }

  /**
   * 寻找阻止对手威胁的位置（防守型战术）
   */
  private findPreventThreatMove(
    board: GameBoard,
    opponent: Player
  ): Move | null {
    const emptyCells = this.getMeaningfulEmptyCells(board);
    let bestDefenseMove: Move | null = null;
    let highestThreatScore = 0;

    for (const cell of emptyCells) {
      const testBoard = this.copyBoard(board);
      testBoard[cell.row][cell.col] = opponent;

      // 评估对手在这个位置的威胁程度
      const directions: [number, number][] = [
        [0, 1], // 水平
        [1, 0], // 垂直
        [1, 1], // 对角线
        [1, -1], // 反对角线
      ];
      let maxThreatInThisCell = 0;

      for (const [dx, dy] of directions) {
        const lineScore = this.evaluateLine(
          testBoard,
          cell.row,
          cell.col,
          dx,
          dy,
          opponent
        );
        maxThreatInThisCell = Math.max(maxThreatInThisCell, lineScore);
      }

      // 寻找威胁最大的位置进行防守
      if (
        maxThreatInThisCell > highestThreatScore &&
        maxThreatInThisCell >= 10
      ) {
        highestThreatScore = maxThreatInThisCell;
        bestDefenseMove = cell;
      }
    }

    if (bestDefenseMove) {
      console.log(
        `[AI] 找到防守威胁位置 (威胁分数: ${highestThreatScore}):`,
        bestDefenseMove
      );
    }

    return bestDefenseMove;
  }
}
