export type CompStyle = 'reroll' | 'carry' | 'fast9';
export type AugmentPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type ItemType = 'component' | 'completed';

export interface Unit {
  name: string;
  cost: 1 | 2 | 3 | 4 | 5;
  count: number; // 最終盤面での枚数
  isCarry?: boolean;
}

export interface AugmentEntry {
  name: string;
  priority: AugmentPriority;
}

export interface ItemEntry {
  name: string;
  type: ItemType;
  target: string; // 装備させるチャンピオン名
}

export interface Comp {
  id: string;
  name: string;
  tier: 'S' | 'A' | 'B';
  style: CompStyle;
  units: Unit[];
  keyEarlyUnits: string[]; // レベル4〜5で優先的に引きたいユニット
  items: ItemEntry[];
  augments: AugmentEntry[];
  traits: { name: string; count: number }[];
  notes: string; // 序盤の狙い目コメント
}

export interface PlayerState {
  champions: string[];
  items: string[];
  augments: string[];
  level: number;
  stage: number;
  round: number;
}

export interface CompScore {
  comp: Comp;
  totalScore: number;
  championScore: number;
  augmentScore: number;
  itemScore: number;
  matchedEarlyUnits: string[];
  recommendation: '狙い目！' | '有力な選択肢' | '要検討';
}
