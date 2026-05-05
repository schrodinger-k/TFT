// Data Dragon (Riot公式CDN) - チャンピオンポートレート
const DDRAGON_VERSION = '15.10.1';
export const DDRAGON_BASE = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion`;

// CommunityDragon - TFTアイテム・オーグメント
const CDRAGON_BASE = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/maps/particles/tft/item_icons';

export function champImg(ddragonName: string): string {
  return `${DDRAGON_BASE}/${ddragonName}.png`;
}

export function itemImg(iconName: string): string {
  return `${CDRAGON_BASE}/standard/${iconName}.png`;
}

export function augmentImg(iconName: string): string {
  return `${CDRAGON_BASE}/augments/hexcore/${iconName}.png`;
}

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
