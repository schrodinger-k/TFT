import { useState } from 'react';
import otpData from '../data/primordian-otp.json';
import championsData from '../data/champions.json';
import itemsData from '../data/items.json';
import augmentsData from '../data/augments.json';
import type { Champion, ItemData, AugmentData } from '../types/comp';
import { champImg, champImgFallback, itemImg, COST_COLORS, COST_GLOW, TRAIT_COLORS, TIER_COLORS } from '../engine/imager';

const allChamps   = championsData as Champion[];
const allItems    = [...(itemsData.components as ItemData[]), ...(itemsData.completed as ItemData[])];
const allAugments = augmentsData as AugmentData[];

const champMap: Record<string, Champion>    = Object.fromEntries(allChamps.map(c => [c.name, c]));
const itemMap:  Record<string, ItemData>    = Object.fromEntries(allItems.map(i => [i.name, i]));
const augMap:   Record<string, AugmentData> = Object.fromEntries(allAugments.map(a => [a.name, a]));

type StarLevel = 1 | 2 | 3;

interface BoardUnit {
  name: string;
  stars: StarLevel;
  isCarry?: boolean;
  note?: string;
}
interface PhaseTrait { name: string; count: number; tier: string }
interface PhaseItemAssign { champion: string; items: string[]; note?: string }
interface PhaseAugment { name: string; priority: 'HIGH' | 'MEDIUM' | 'LOW'; reason: string }
interface Phase {
  id: string;
  label: string;
  stages: string;
  level: number;
  gold: string;
  goal: string;
  board: BoardUnit[];
  traits: PhaseTrait[];
  items: PhaseItemAssign[];
  augments: PhaseAugment[];
  tips: string[];
}

const data = otpData as {
  compName: string;
  patch: string;
  carry: string;
  tier: string;
  playstyle: string;
  summary: string;
  bestAugments: string[];
  bisItems: { champion: string; items: string[]; role: string }[];
  phases: Phase[];
};

const PRI_COLOR = TRAIT_COLORS['Primordian'];

export default function PrimordianDashboard() {
  const [activePhase, setActivePhase] = useState<string>(data.phases[0].id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px 28px' }}>
      {/* ヘッダーカード */}
      <div style={{
        padding: '20px 24px', borderRadius: '14px',
        background: `linear-gradient(135deg, ${PRI_COLOR.bg}, #050810)`,
        border: `1px solid ${PRI_COLOR.border}`,
        boxShadow: `0 0 32px ${PRI_COLOR.glow}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <div style={{
            padding: '4px 12px', borderRadius: '14px',
            background: PRI_COLOR.border, color: '#fff',
            fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px',
          }}>S TIER · OTP</div>
          <div style={{
            padding: '4px 10px', borderRadius: '14px',
            background: '#1a1a3a', color: '#a78bfa',
            fontSize: '11px', fontWeight: 700,
          }}>Patch {data.patch}</div>
        </div>
        <h1 style={{
          margin: 0, fontSize: '24px', fontWeight: 900,
          background: `linear-gradient(135deg, ${PRI_COLOR.text}, #fbbf24)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          {data.compName}
        </h1>
        <p style={{ margin: '10px 0 0', fontSize: '13px', color: '#94a3b8', lineHeight: 1.7 }}>
          {data.summary}
        </p>

        {/* Carryアイコン */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '14px' }}>
          <span style={{ fontSize: '11px', color: '#6b6b9a' }}>メインキャリー</span>
          <CarryHero name={data.carry} />
          <span style={{ fontSize: '11px', color: '#6b6b9a', marginLeft: '12px' }}>BIS</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {data.bisItems[0].items.map(item => <ItemIcon key={item} name={item} size={32} />)}
          </div>
        </div>
      </div>

      {/* フェーズタブ */}
      <div style={{
        display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px',
        borderBottom: '1px solid #1e1e4a',
      }}>
        {data.phases.map((p, idx) => {
          const active = activePhase === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePhase(p.id)}
              style={{
                flexShrink: 0, padding: '10px 18px', cursor: 'pointer',
                border: 'none', borderRadius: '8px 8px 0 0',
                background: active ? '#15153a' : 'transparent',
                color: active ? PRI_COLOR.text : '#5a5a7a',
                borderBottom: active ? `2px solid ${PRI_COLOR.border}` : '2px solid transparent',
                fontSize: '13px', fontWeight: active ? 700 : 500,
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all .15s',
              }}
            >
              <span style={{
                width: '20px', height: '20px', borderRadius: '50%',
                background: active ? PRI_COLOR.border : '#1a1a3a',
                color: active ? '#fff' : '#6b6b9a',
                fontSize: '11px', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{idx + 1}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '13px', lineHeight: 1.1 }}>{p.label}</div>
                <div style={{ fontSize: '10px', color: '#444', marginTop: '2px' }}>{p.stages}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* アクティブフェーズ詳細 */}
      {data.phases
        .filter(p => p.id === activePhase)
        .map(phase => <PhasePanel key={phase.id} phase={phase} />)
      }

      {/* 全フェーズ一覧（タイムライン） */}
      <details style={{ marginTop: '8px' }}>
        <summary style={{
          cursor: 'pointer', padding: '10px 14px', fontSize: '13px',
          color: '#7c7caa', background: '#0c0c22',
          border: '1px solid #1e1e4a', borderRadius: '8px',
          listStyle: 'none', userSelect: 'none', fontWeight: 600,
        }}>
          ▸ 全フェーズタイムラインを一覧表示
        </summary>
        <div style={{ display: 'grid', gap: '14px', marginTop: '14px' }}>
          {data.phases.map(phase => <PhasePanel key={phase.id} phase={phase} compact />)}
        </div>
      </details>
    </div>
  );
}

function PhasePanel({ phase, compact = false }: { phase: Phase; compact?: boolean }) {
  return (
    <div style={{
      borderRadius: '12px', overflow: 'hidden',
      background: '#0a0a1c', border: '1px solid #1e1e4a',
    }}>
      {/* フェーズヘッダ */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px', background: 'linear-gradient(90deg, #0e0e26, #0a0a1c)',
        borderBottom: '1px solid #1a1a3a',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#e0e0ff' }}>
              {phase.label}
            </h3>
            <span style={{ fontSize: '12px', color: '#7c7caa' }}>{phase.stages}</span>
          </div>
          <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b6b9a', lineHeight: 1.5 }}>
            🎯 {phase.goal}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
          <Badge label="Lv" value={`${phase.level}`} color="#a78bfa" />
          <Badge label="Gold" value={phase.gold} color="#fbbf24" />
        </div>
      </div>

      <div style={{ padding: '16px 18px', display: 'grid', gap: '18px' }}>
        {/* チャンピオン構成 */}
        <Section title="🦸 チャンピオン構成 (盤面)">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {phase.board.map(unit => (
              <BoardChampion key={unit.name} unit={unit} compact={compact} />
            ))}
          </div>
          {/* シナジー */}
          {phase.traits.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
              {phase.traits.map(t => <TraitChip key={t.name} trait={t} />)}
            </div>
          )}
        </Section>

        {/* チャンピオン別アイテム */}
        <Section title="🛡️ チャンピオン別アイテム">
          <div style={{ display: 'grid', gap: '10px' }}>
            {phase.items.map(assign => <ItemAssignRow key={assign.champion} assign={assign} />)}
          </div>
        </Section>

        {/* オーグメント */}
        <Section title="🔮 推奨オーグメント">
          <div style={{ display: 'grid', gap: '8px' }}>
            {phase.augments.map(aug => <AugmentRow key={aug.name} aug={aug} />)}
          </div>
        </Section>

        {/* 立ち回りTips */}
        {phase.tips.length > 0 && (
          <Section title="💡 立ち回りTips">
            <ul style={{
              margin: 0, paddingLeft: '20px', display: 'grid', gap: '4px',
              fontSize: '12px', color: '#94a3b8', lineHeight: 1.7,
            }}>
              {phase.tips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </Section>
        )}
      </div>
    </div>
  );
}

// ========== サブコンポーネント ==========

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{
        fontSize: '11px', fontWeight: 700, color: '#8b8bbb',
        marginBottom: '8px', letterSpacing: '0.5px',
      }}>{title}</div>
      {children}
    </div>
  );
}

function Badge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      padding: '4px 10px', borderRadius: '6px',
      background: '#0a0a20', border: `1px solid ${color}33`,
      fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px',
    }}>
      <span style={{ color: '#444' }}>{label}</span>
      <span style={{ color, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function CarryHero({ name }: { name: string }) {
  const ch = champMap[name];
  if (!ch) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden',
        border: '2px solid #fbbf24',
        boxShadow: '0 0 12px rgba(251,191,36,0.5)',
        background: '#111',
      }}>
        <img src={champImg(ch.ddragon)} alt={ch.nameJa}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = champImgFallback(ch.cdkey); }}
        />
      </div>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#fbbf24' }}>{ch.nameJa}</div>
        <div style={{ fontSize: '10px', color: '#6b6b9a' }}>{ch.cost}コスト · AP Carry</div>
      </div>
    </div>
  );
}

function BoardChampion({ unit, compact }: { unit: BoardUnit; compact: boolean }) {
  const ch = champMap[unit.name];
  if (!ch) return null;
  const size = compact ? 56 : 64;
  const borderColor = unit.isCarry ? '#fbbf24' : COST_COLORS[ch.cost];
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
      width: size + 8,
    }}>
      <div style={{
        width: size, height: size, borderRadius: '8px', overflow: 'hidden', position: 'relative',
        border: `2px solid ${borderColor}`,
        boxShadow: unit.isCarry
          ? '0 0 12px rgba(251,191,36,0.55)'
          : `0 0 8px ${COST_GLOW[ch.cost]}`,
        background: '#111',
      }}>
        <img src={champImg(ch.ddragon)} alt={ch.nameJa}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = champImgFallback(ch.cdkey); }}
        />
        {/* スター */}
        <div style={{
          position: 'absolute', top: '2px', left: '2px',
          padding: '1px 4px', borderRadius: '3px',
          background: 'rgba(0,0,0,0.7)',
          color: starColor(unit.stars),
          fontSize: '9px', fontWeight: 800, letterSpacing: '-1px',
        }}>{'★'.repeat(unit.stars)}</div>
        {unit.isCarry && (
          <div style={{
            position: 'absolute', bottom: '2px', right: '2px',
            background: '#fbbf24', color: '#000',
            borderRadius: '3px', padding: '0 4px',
            fontSize: '9px', fontWeight: 900,
          }}>C</div>
        )}
      </div>
      <span style={{
        fontSize: '10px', color: '#a0a0c0', textAlign: 'center',
        maxWidth: size + 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{ch.nameJa}</span>
      {unit.note && !compact && (
        <span style={{
          fontSize: '9px', color: '#5a5a7a', textAlign: 'center',
          lineHeight: 1.3, maxWidth: size + 16,
        }}>{unit.note}</span>
      )}
    </div>
  );
}

function starColor(stars: StarLevel): string {
  if (stars === 3) return '#fbbf24';
  if (stars === 2) return '#c0c0c0';
  return '#a0a0a0';
}

function TraitChip({ trait }: { trait: PhaseTrait }) {
  const tc = TRAIT_COLORS[trait.name] ?? TRAIT_COLORS['General'];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '4px 10px', borderRadius: '14px',
      background: tc.bg, border: `1px solid ${tc.border}`,
      fontSize: '11px', fontWeight: 600, color: tc.text,
    }}>
      <span style={{
        width: '18px', height: '18px', borderRadius: '50%',
        background: tc.border, color: '#fff',
        fontSize: '10px', fontWeight: 800,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{trait.count}</span>
      {trait.name}
      {trait.tier !== '—' && (
        <span style={{ fontSize: '9px', color: tc.text, opacity: 0.7 }}>· {trait.tier}</span>
      )}
    </div>
  );
}

function ItemAssignRow({ assign }: { assign: PhaseItemAssign }) {
  const ch = champMap[assign.champion];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '10px 12px', borderRadius: '8px',
      background: '#0c0c22', border: '1px solid #1e1e4a',
    }}>
      {/* チャンピオン */}
      {ch && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '7px', overflow: 'hidden',
            border: `2px solid ${COST_COLORS[ch.cost]}`,
            boxShadow: `0 0 6px ${COST_GLOW[ch.cost]}`,
            background: '#111',
          }}>
            <img src={champImg(ch.ddragon)} alt={ch.nameJa}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = champImgFallback(ch.cdkey); }}
            />
          </div>
          <span style={{ fontSize: '9px', color: '#a0a0c0', maxWidth: '52px', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {ch.nameJa}
          </span>
        </div>
      )}
      {/* 矢印 */}
      <span style={{ fontSize: '14px', color: '#4a4a7a' }}>→</span>
      {/* アイテム */}
      <div style={{ display: 'flex', gap: '6px', flex: 1, flexWrap: 'wrap' }}>
        {assign.items.map(item => <ItemIcon key={item} name={item} />)}
      </div>
      {/* メモ */}
      {assign.note && (
        <div style={{ fontSize: '11px', color: '#6b6b9a', maxWidth: '160px', lineHeight: 1.4 }}>
          {assign.note}
        </div>
      )}
    </div>
  );
}

function ItemIcon({ name, size = 36 }: { name: string; size?: number }) {
  const item = itemMap[name];
  const [failed, setFailed] = useState(false);
  if (!item) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '6px',
        background: '#1a1a2e', border: '1px solid #2a2a5a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '8px', color: '#888', textAlign: 'center', padding: '2px',
      }}>{name}</div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
      <div title={item.nameJa} style={{
        width: size, height: size, borderRadius: '6px', overflow: 'hidden',
        border: '1px solid #2a2a5a', background: failed ? '#1a1a2e' : '#111',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {failed ? (
          <span style={{ fontSize: '8px', color: '#888', textAlign: 'center', padding: '2px', lineHeight: 1.2 }}>
            {item.nameJa}
          </span>
        ) : (
          <img src={itemImg(item.cdkey)} alt={item.nameJa}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <span style={{
        fontSize: '9px', color: '#7c7caa',
        maxWidth: size + 12, textAlign: 'center',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{item.nameJa}</span>
    </div>
  );
}

function AugmentRow({ aug }: { aug: PhaseAugment }) {
  const ad = augMap[aug.name];
  const tc = ad ? (TRAIT_COLORS[ad.trait] ?? TRAIT_COLORS['General']) : TRAIT_COLORS['General'];
  const tierColor = ad ? (TIER_COLORS[ad.tier] ?? '#94a3b8') : '#94a3b8';
  const prioColor = aug.priority === 'HIGH' ? '#22c55e'
    : aug.priority === 'MEDIUM' ? '#f59e0b' : '#6b7280';
  const prioLabel = aug.priority === 'HIGH' ? '最優先'
    : aug.priority === 'MEDIUM' ? '推奨' : '保険';
  const augmentArt = ad ? augmentImg(ad) : null;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '10px 12px', borderRadius: '8px',
      background: tc.bg, border: `1px solid ${tc.border}`,
    }}>
      {/* オーグメント画像 */}
      <div style={{
        width: '44px', height: '44px', borderRadius: '8px', overflow: 'hidden',
        border: `2px solid ${tierColor}`,
        boxShadow: `0 0 8px ${tierColor}55`,
        background: '#0a0a1a', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {augmentArt ? (
          <AugmentImage trait={ad!.trait} tier={ad!.tier} src={augmentArt} />
        ) : (
          <span style={{ fontSize: '20px' }}>🔮</span>
        )}
      </div>
      {/* 名前・理由 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: tc.text }}>
            {ad?.nameJa ?? aug.name}
          </span>
          {ad && (
            <span style={{
              padding: '1px 6px', borderRadius: '4px',
              background: `${tierColor}22`, border: `1px solid ${tierColor}55`,
              fontSize: '9px', fontWeight: 700, color: tierColor,
            }}>{ad.tier}</span>
          )}
        </div>
        <div style={{ fontSize: '11px', color: '#7c7caa', marginTop: '3px', lineHeight: 1.5 }}>
          {aug.reason}
        </div>
      </div>
      {/* 優先度 */}
      <div style={{
        padding: '4px 10px', borderRadius: '12px',
        background: `${prioColor}22`, border: `1px solid ${prioColor}55`,
        color: prioColor, fontSize: '10px', fontWeight: 800, flexShrink: 0,
      }}>
        {prioLabel}
      </div>
    </div>
  );
}

// オーグメント画像（CommunityDragon TFT augment icons）
function augmentImg(ad: AugmentData): string | null {
  // CommunityDragon TFT augments path
  // Naming convention: "tft_augment_<key>" but exact key varies; we'll fall back gracefully
  const slug = ad.name.toLowerCase()
    .replace(/['!?]/g, '')
    .replace(/\s+/g, '');
  return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/maps/particles/tft/augments/icons/${slug}.png`;
}

function AugmentImage({ trait, tier, src }: { trait: string; tier: string; src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    const tc = TRAIT_COLORS[trait] ?? TRAIT_COLORS['General'];
    const icon = tier === 'Crown' ? '👑'
      : tier === 'Heart' ? '❤️'
      : tier === 'Crest' ? '🛡️'
      : tier === 'Emblem' ? '⚜️'
      : tier === 'Prismatic' ? '💎'
      : tier === 'Gold' ? '🥇'
      : tier === 'Silver' ? '🥈'
      : '✦';
    return (
      <span style={{ fontSize: '20px', filter: `drop-shadow(0 0 4px ${tc.border})` }}>
        {icon}
      </span>
    );
  }
  return (
    <img src={src} alt=""
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      onError={() => setFailed(true)}
    />
  );
}
