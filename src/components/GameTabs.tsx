import React, { useState } from "react";
import { Player } from "../hooks/useGomoku";
import { type GameConfig as GameConfigType } from "../hooks/useGameConfig";
import { TimerState, TimerConfig } from "../hooks/useGameTimer";
import GameInfo from "./GameInfo";
import GameTimer from "./GameTimer";
import GameConfig from "./GameConfig";
import GameRules from "./GameRules";

interface GameTabsProps {
  // GameInfo props
  currentPlayer: Player;
  gameTime: number;
  moveCount: number;
  audioEnabled: boolean;
  volume: number;
  toggleAudio: () => void;
  setVolume: (volume: number) => void;

  // GameTimer props
  timerState: TimerState;
  timerConfig: TimerConfig;
  gameActive: boolean;
  updateTimerConfig: (config: Partial<TimerConfig>) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  formatTime: (seconds: number) => string;
  isTimeUp: (player: Player) => boolean;

  // GameConfig props
  config: GameConfigType;
  setBoardSize: (size: any) => void;
  setWinCondition: (condition: number) => void;
  setFirstPlayer: (player: Player) => void;
  setAllowUndo: (allow: boolean) => void;
  resetConfig: () => void;
  onApplyConfig?: () => void;
}

type TabType = "info" | "timer" | "settings" | "rules";

const GameTabs: React.FC<GameTabsProps> = ({
  // GameInfo props
  currentPlayer,
  gameTime,
  moveCount,
  audioEnabled,
  volume,
  toggleAudio,
  setVolume,

  // GameTimer props
  timerState,
  timerConfig,
  gameActive,
  updateTimerConfig,
  pauseTimer,
  resumeTimer,
  resetTimer,
  formatTime,
  isTimeUp,

  // GameConfig props
  config,
  setBoardSize,
  setWinCondition,
  setFirstPlayer,
  setAllowUndo,
  resetConfig,
  onApplyConfig,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("info");

  const tabs = [
    {
      id: "info" as TabType,
      label: "游戏信息",
      icon: "fa-info-circle",
      component: (
        <GameInfo
          currentPlayer={currentPlayer}
          gameTime={gameTime}
          moveCount={moveCount}
          audioEnabled={audioEnabled}
          volume={volume}
          toggleAudio={toggleAudio}
          setVolume={setVolume}
        />
      ),
    },
    {
      id: "timer" as TabType,
      label: "计时器",
      icon: "fa-clock",
      component: (
        <GameTimer
          timerState={timerState}
          config={timerConfig}
          currentPlayer={currentPlayer}
          gameActive={gameActive}
          updateConfig={updateTimerConfig}
          pauseTimer={pauseTimer}
          resumeTimer={resumeTimer}
          resetTimer={resetTimer}
          formatTime={formatTime}
          isTimeUp={isTimeUp}
        />
      ),
    },
    {
      id: "settings" as TabType,
      label: "游戏设置",
      icon: "fa-cog",
      component: (
        <GameConfig
          config={config}
          setBoardSize={setBoardSize}
          setWinCondition={setWinCondition}
          setFirstPlayer={setFirstPlayer}
          setAllowUndo={setAllowUndo}
          resetConfig={resetConfig}
          onApplyConfig={onApplyConfig}
        />
      ),
    },
    {
      id: "rules" as TabType,
      label: "游戏规则",
      icon: "fa-book",
      component: <GameRules />,
    },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 标签页导航 */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-0" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-2 text-center text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <i className={`fa-solid ${tab.icon} text-base`}></i>
                <span className="text-xs">{tab.label}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* 标签页内容 */}
      <div className="min-h-[400px]">{activeTabData?.component}</div>
    </div>
  );
};

export default GameTabs;
