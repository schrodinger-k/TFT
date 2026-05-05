export type CompStyle = 'reroll' | 'carry' | 'fast9';
export type AugmentPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Unit {
  name: string;
  cost: 1 | 2 | 3 | 4 | 5;
  count: number;
  isCarry?: boolean;
}

export interface AugmentEntry { name: string; priority: AugmentPriority }
export interface ItemEntry    { name: string; type: 'component'|'completed'; target: string }

export interface Comp {
  id: string;
  name: string;
  tier: 'S'|'A'|'B';
  style: CompStyle;
  units: Unit[];
  keyEarlyUnits: string[];
  items: ItemEntry[];
  augments: AugmentEntry[];
  traits: { name: string; count: number }[];
  notes: string;
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
  recommendation: '狙い目！'|'有力な選択肢'|'要検討';
}

export interface Champion {
  name: string;
  cost: 1|2|3|4|5;
  traits: string[];
  ddragon: string;
}

export interface ItemData {
  name: string;
  icon: string;
}

export interface AugmentData {
  name: string;
  icon: string;
}
