import type { Comp, CompScore, PlayerState } from '../types/comp';

const ITEM_COMPONENTS: Record<string, string[]> = {
  "Rabadon's Deathcap":  ["Needlessly Large Rod", "Needlessly Large Rod"],
  "Jeweled Gauntlet":    ["Needlessly Large Rod", "Sparring Gloves"],
  "Archangel's Staff":   ["Tear of the Goddess", "Needlessly Large Rod"],
  "Guinsoo's Rageblade": ["Recurve Bow", "Tear of the Goddess"],
  "Rapid Firecannon":    ["Recurve Bow", "Recurve Bow"],
  "Infinity Edge":       ["BF Sword", "Sparring Gloves"],
  "Last Whisper":        ["BF Sword", "Recurve Bow"],
  "Bloodthirster":       ["BF Sword", "Giant's Belt"],
  "Titan's Resolve":     ["Recurve Bow", "Chain Vest"],
  "Blue Buff":           ["Tear of the Goddess", "Tear of the Goddess"],
  "Spear of Shojin":     ["BF Sword", "Tear of the Goddess"],
  "Shadowflame":         ["Needlessly Large Rod", "Giant's Belt"],
  "Hextech Gunblade":    ["BF Sword", "Needlessly Large Rod"],
  "Bramble Vest":        ["Chain Vest", "Chain Vest"],
  "Dragon's Claw":       ["Negatron Cloak", "Negatron Cloak"],
  "Warmog's Armor":      ["Giant's Belt", "Giant's Belt"],
};

function championScore(comp: Comp, champions: string[]): { score: number; matched: string[] } {
  let score = 0;
  const matched: string[] = [];

  for (const u of comp.keyEarlyUnits) {
    if (champions.includes(u)) { score += 15; matched.push(u); }
  }
  const carries = comp.units.filter(u => u.isCarry).map(u => u.name);
  if (carries.filter(c => champions.includes(c)).length >= 2) score += 10;
  for (const u of comp.units) {
    if (!comp.keyEarlyUnits.includes(u.name) && champions.includes(u.name)) score += 5;
  }
  return { score: Math.min(score, 50), matched };
}

function augmentScore(comp: Comp, augments: string[]): number {
  let score = 0;
  for (const a of comp.augments) {
    if (!augments.includes(a.name)) continue;
    score += a.priority === 'HIGH' ? 15 : a.priority === 'MEDIUM' ? 8 : 4;
  }
  return Math.min(score, 30);
}

function itemScore(comp: Comp, items: string[]): number {
  let score = 0;
  for (const entry of comp.items) {
    if (items.includes(entry.name)) { score += 10; continue; }
    const comps = ITEM_COMPONENTS[entry.name] || [];
    for (const c of comps) { if (items.includes(c)) score += 5; }
  }
  return Math.min(score, 20);
}

export function calculateScores(comps: Comp[], state: PlayerState): CompScore[] {
  return comps.map(comp => {
    const { score: cs, matched } = championScore(comp, state.champions);
    const as_ = augmentScore(comp, state.augments);
    const is_ = itemScore(comp, state.items);
    const total = Math.round(cs + as_ + is_);
    return {
      comp, totalScore: total,
      championScore: cs, augmentScore: as_, itemScore: is_,
      matchedEarlyUnits: matched,
      recommendation: (total >= 60 ? '狙い目！' : total >= 35 ? '有力な選択肢' : '要検討') as '狙い目！' | '有力な選択肢' | '要検討',
    };
  }).sort((a, b) =>
    b.totalScore !== a.totalScore ? b.totalScore - a.totalScore :
    b.augmentScore !== a.augmentScore ? b.augmentScore - a.augmentScore :
    b.championScore - a.championScore
  );
}
