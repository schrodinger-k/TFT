// ========== Data Dragon (Riot公式CDN) ==========
// バージョンをブラウザから動的に取得して更新可能にする
export let DD_VERSION = '26.9.1';
export function updateDDVersion(v: string) { DD_VERSION = v; }

/** チャンピオンポートレート (DDragon) */
export function champImg(ddragon: string): string {
  return `https://ddragon.leagueoflegends.com/cdn/${DD_VERSION}/img/champion/${ddragon}.png`;
}

/** チャンピオンポートレート フォールバック (CDragon squareアイコン) */
export function champImgFallback(cdkey: string): string {
  return `https://raw.communitydragon.org/latest/game/assets/characters/${cdkey}/hud/${cdkey}_square.png`;
}

// ========== CommunityDragon (TFTアイテム) ==========
const CDRAGON_ITEMS = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/maps/particles/tft/item_icons';

/** TFT標準アイテムアイコン (CDragon) */
export function itemImg(cdkey: string): string {
  return `${CDRAGON_ITEMS}/standard/${cdkey}.png`;
}

// ========== コスト別カラー ==========
export const COST_COLORS: Record<number, string> = {
  1: '#9e9e9e',
  2: '#4caf50',
  3: '#2196f3',
  4: '#9c27b0',
  5: '#ffc107',
};
export const COST_GLOW: Record<number, string> = {
  1: 'rgba(158,158,158,0.4)',
  2: 'rgba(76,175,80,0.4)',
  3: 'rgba(33,150,243,0.4)',
  4: 'rgba(156,39,176,0.4)',
  5: 'rgba(255,193,7,0.4)',
};

// ========== オーグメント・トレイト別カラー ==========
export const TRAIT_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  'Dark Star':   { bg:'#0a0520', border:'#4a1a8a', text:'#c084fc', glow:'rgba(139,92,246,0.35)' },
  'Fateweaver': { bg:'#1a1000', border:'#92610a', text:'#fbbf24', glow:'rgba(251,191,36,0.35)' },
  'Primordian': { bg:'#0a1a10', border:'#1a6b3a', text:'#34d399', glow:'rgba(52,211,153,0.35)' },
  'Stargazer':  { bg:'#001a2a', border:'#0a5a8a', text:'#38bdf8', glow:'rgba(56,189,248,0.35)' },
  'Fated':      { bg:'#1a0a00', border:'#8a3a0a', text:'#fb923c', glow:'rgba(251,146,60,0.35)' },
  'Void':       { bg:'#120a1a', border:'#5a0a8a', text:'#a855f7', glow:'rgba(168,85,247,0.35)' },
  'General':    { bg:'#0a0a1a', border:'#2a2a5a', text:'#94a3b8', glow:'rgba(148,163,184,0.2)' },
};

export const TIER_COLORS: Record<string, string> = {
  'Crown':    '#ffd700',
  'Crest':    '#c0c0c0',
  'Heart':    '#ef4444',
  'Emblem':   '#38bdf8',
  'Special':  '#a855f7',
  'Prismatic':'#f472b6',
  'Gold':     '#fbbf24',
  'Silver':   '#94a3b8',
};
