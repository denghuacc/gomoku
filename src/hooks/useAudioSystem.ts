import { useState, useCallback, useRef, useEffect } from "react";

interface AudioSystemConfig {
  enabled: boolean;
  volume: number;
}

interface UseAudioSystemReturn {
  audioEnabled: boolean;
  volume: number;
  toggleAudio: () => void;
  setVolume: (volume: number) => void;
  playMoveSound: () => void;
  playWinSound: () => void;
}

export const useAudioSystem = (): UseAudioSystemReturn => {
  const [config, setConfig] = useState<AudioSystemConfig>(() => {
    const saved = localStorage.getItem("gomoku-audio-config");
    return saved ? JSON.parse(saved) : { enabled: true, volume: 0.3 };
  });

  // 使用ref存储最新的config，避免闭包问题
  const configRef = useRef(config);
  configRef.current = config;

  // 调试：监听config变化
  useEffect(() => {
    console.log("Audio config updated:", config);
  }, [config]);

  const audioContextRef = useRef<AudioContext | null>(null);

  // 初始化音频上下文
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // 保存配置到本地存储
  useEffect(() => {
    localStorage.setItem("gomoku-audio-config", JSON.stringify(config));
  }, [config]);

  // 生成落子音效 - 简短清脆的点击声
  const playMoveSound = useCallback(() => {
    // 使用ref获取最新的config状态，避免闭包问题
    const currentConfig = configRef.current;
    if (!currentConfig.enabled) return;

    console.log("Playing move sound with volume:", currentConfig.volume); // 调试日志

    try {
      const audioContext = initAudioContext();
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      // 创建振荡器产生基础音调
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // 连接音频节点
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // 设置音调参数 - 清脆的点击声
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        400,
        audioContext.currentTime + 0.1
      );

      // 设置音量包络 - 使用当前config.volume
      const currentVolume = currentConfig.volume;
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        currentVolume,
        audioContext.currentTime + 0.01
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.15
      );

      // 播放
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    } catch (error) {
      console.warn("Failed to play move sound:", error);
    }
  }, [initAudioContext]);

  // 生成胜利音效 - 胜利的旋律
  const playWinSound = useCallback(() => {
    // 使用ref获取最新的config状态，避免闭包问题
    const currentConfig = configRef.current;
    if (!currentConfig.enabled) return;

    console.log("Playing win sound with volume:", currentConfig.volume); // 调试日志

    try {
      const audioContext = initAudioContext();
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      // 胜利音效的音符序列 (简单的上升音阶)
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const noteDuration = 0.2;
      const totalDuration = notes.length * noteDuration;

      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const startTime = audioContext.currentTime + index * noteDuration;
        const endTime = startTime + noteDuration;

        // 设置音调
        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.type = "sine";

        // 设置音量包络
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(
          currentConfig.volume * 0.8,
          startTime + 0.02
        );
        gainNode.gain.linearRampToValueAtTime(
          currentConfig.volume * 0.8,
          endTime - 0.05
        );
        gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);

        oscillator.start(startTime);
        oscillator.stop(endTime);
      });

      // 添加最后的和弦效果
      setTimeout(() => {
        const chord = [523.25, 659.25, 783.99]; // C大调和弦
        chord.forEach(frequency => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          const startTime = audioContext.currentTime;
          const endTime = startTime + 1.0;

          oscillator.frequency.setValueAtTime(frequency, startTime);
          oscillator.type = "sine";

          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(
            currentConfig.volume * 0.6,
            startTime + 0.1
          );
          gainNode.gain.linearRampToValueAtTime(
            currentConfig.volume * 0.6,
            endTime - 0.3
          );
          gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);

          oscillator.start(startTime);
          oscillator.stop(endTime);
        });
      }, totalDuration * 1000);
    } catch (error) {
      console.warn("Failed to play win sound:", error);
    }
  }, [initAudioContext]);

  // 切换音效开关
  const toggleAudio = useCallback(() => {
    setConfig(prev => ({ ...prev, enabled: !prev.enabled }));
  }, []);

  // 设置音量
  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    console.log("Setting volume to:", clampedVolume); // 调试日志
    setConfig(prev => ({
      ...prev,
      volume: clampedVolume,
    }));
  }, []);

  return {
    audioEnabled: config.enabled,
    volume: config.volume,
    toggleAudio,
    setVolume,
    playMoveSound,
    playWinSound,
  };
};
