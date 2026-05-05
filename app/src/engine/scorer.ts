import type { Comp, CompScore, PlayerState } from '../types/comp';

// アイテムコンポーネントと完成アイテムのマッピング
const ITEM_COMPONENTS: Record<string, string[]> = {
  "Rabadon's Deathcap": ["Needlessly Large Rod", "Needlessly Large Rod"],
  "Jeweled Gauntlet": ["Needlessly Large Rod", "Sparring Gloves"],
  "Archangel's Staff": ["Tear of the Goddess", "Needlessly Large Rod"],
  "Guinsoo's Rageblade": ["Recurve Bow", "Tear of the Goddess"],
  "Rapid Firecannon": ["Recurve Bow", "Recurve Bow"],
  "Infinity Edge": ["BF Sword", "Sparring Gloves"],
  "Last Whisper": ["BF Sword", "Recurve Bow"],
  "Bloodthirster": ["BF Sword", "Giant's Belt"],
  "Titan's Resolve": ["Recurve Bow", "Chain Vest"],
  "Blue Buff": ["Tear of the Goddess", "Tear of the Goddess"],
  "Spear of Shojin": ["BF Sword", "Tear of the Goddess"],
  "Shadowflame": ["Needlessly Large Rod", "Giant's Belt"],
  "Hextech Gunblade": ["BF Sword", "Needlessly Large Rod"],
  "Bramble Vest": ["Chain Vest", "Chain Vest"],
};

function calculateChampionScore(comp: Comp, champions: string[]): {
  score: number;
  matchedEarlyUnits: string[];
} {
  let score = 0;
  const matchedEarlyUnits: string[] = [];

  for (const earlyUnit of comp.keyEarlyUnits) {
    if (champions.includes(earlyUnit)) {
      score += 15;
      matchedEarlyUnits.push(earlyUnit);
    }
  }

  const carries = comp.units.filter(u => u.isCarry).map(u => u.name);
  const carryCount = carries.filter(c => champions.includes(c)).length;
  if (carryCount >= 2) score += 10;

  for (const unit of comp.units) {
    if (!comp.keyEarlyUnits.includes(unit.name) && champions.includes(unit.name)) {
      score += 5;
    }
  }

  return { score: Math.min(score, 50), matchedEarlyUnits };
}

function calculateAugmentScore(comp: Comp, augments: string[]): number {
  let score = 0;

  for (const augEntry of comp.augments) {
    if (augments.includes(augEntry.name)) {
      if (augEntry.priority === 'HIGH') score += 15;
      else if (augEntry.priority === 'MEDIUM') score += 8;
      else score += 4;
    }
  }

  return Math.min(score, 30);
}

function calculateItemScore(comp: Comp, items: string[]): number {
  let score = 0;

  for (const itemEntry of comp.items) {
    // 完成アイテムを持っている
    if (items.includes(itemEntry.name)) {
      score += 10;
      continue;
    }
    // コンポーネントを持っている
    const components = ITEM_COMPONENTS[itemEntry.name] || [];
    for (const comp_item of components) {
      if (items.includes(comp_item)) {
        score += 5;
      }
    }
  }

  return Math.min(score, 20);
}

function getRecommendation(score: number): '狙い目！' | '有力な選択肢' | '要検討' {
  if (score >= 60) return '狙い目！';
  if (score >= 35) return '有力な選択肢';
  return '要検討';
}

export function calculateScores(comps: Comp[], playerState: PlayerState): CompScore[] {
  const scores: CompScore[] = comps.map(comp => {
    const { score: championScore, matchedEarlyUnits } = calculateChampionScore(comp, playerState.champions);
    const augmentScore = calculateAugmentScore(comp, playerState.augments);
    const itemScore = calculateItemScore(comp, playerState.items);

    const totalScore = Math.round(
      (championScore / 50) * 50 +
      (augmentScore / 30) * 30 +
      (itemScore / 20) * 20
    );

    return {
      comp,
      totalScore,
      championScore,
      augmentScore,
      itemScore,
      matchedEarlyUnits,
      recommendation: getRecommendation(totalScore),
    };
  });

  return scores.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (b.augmentScore !== a.augmentScore) return b.augmentScore - a.augmentScore;
    return b.championScore - a.championScore;
  });
}
