import { useState, useEffect, useCallback } from 'react';
import type { PlayerState } from '../types/comp';

const STORAGE_KEY = 'tft-companion-state';

const defaultState: PlayerState = {
  champions: [],
  items: [],
  augments: [],
  level: 4,
  stage: 2,
  round: 1,
};

function loadState(): PlayerState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...defaultState, ...JSON.parse(saved) };
  } catch {}
  return defaultState;
}

export function useGameState() {
  const [state, setState] = useState<PlayerState>(loadState);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, 500);
    return () => clearTimeout(timer);
  }, [state]);

  const toggleChampion = useCallback((name: string) => {
    setState(prev => ({
      ...prev,
      champions: prev.champions.includes(name)
        ? prev.champions.filter(c => c !== name)
        : [...prev.champions, name],
    }));
  }, []);

  const toggleItem = useCallback((name: string) => {
    setState(prev => ({
      ...prev,
      items: prev.items.includes(name)
        ? prev.items.filter(i => i !== name)
        : [...prev.items, name],
    }));
  }, []);

  const toggleAugment = useCallback((name: string) => {
    setState(prev => {
      if (prev.augments.includes(name)) {
        return { ...prev, augments: prev.augments.filter(a => a !== name) };
      }
      if (prev.augments.length >= 3) return prev;
      return { ...prev, augments: [...prev.augments, name] };
    });
  }, []);

  const setLevel = useCallback((level: number) => {
    setState(prev => ({ ...prev, level }));
  }, []);

  const setStage = useCallback((stage: number, round: number) => {
    setState(prev => ({ ...prev, stage, round }));
  }, []);

  const resetGame = useCallback(() => {
    if (confirm('ゲーム状態をリセットしますか？')) {
      setState(defaultState);
    }
  }, []);

  return { state, toggleChampion, toggleItem, toggleAugment, setLevel, setStage, resetGame };
}
