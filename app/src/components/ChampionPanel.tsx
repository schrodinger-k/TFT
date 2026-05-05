import { useState } from 'react';
import championsData from '../data/champions.json';
import { champImg, COST_COLORS, COST_GLOW } from '../engine/imager';
import type { Champion } from '../types/comp';

const champions = championsData as Champion[];

interface Props {
  selected: string[];
  onToggle: (name: string) => void;
}

export default function ChampionPanel({ selected, onToggle }: Props) {
  const [search, setSearch] = useState('');
  const [costFilter, setCostFilter] = useState<number|null>(null);

  const filtered = champions.filter(c => {
    const s = c.name.toLowerCase().includes(search.toLowerCase());
    const f = costFilter === null || c.cost === costFilter;
    return s && f;
  });

  const byCost = [1,2,3,4,5].map(cost => ({
    cost, champs: filtered.filter(c => c.cost === cost),
  })).filter(g => g.champs.length > 0);

  return (
    <div style={{ padding: '12px 14px' }}>
      {/* 検索＋コストフィルター */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="チャンピオン検索..."
          style={{
            flex: 1, minWidth: '110px', padding: '7px 12px',
            background: '#0f0f2e', border: '1px solid #2a2a5a',
            borderRadius: '7px', color: '#ccc', fontSize: '13px', outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: '4px' }}>
          {[null,1,2,3,4,5].map(cost => (
            <button key={cost??'all'} onClick={() => setCostFilter(cost)} style={{
              padding: '6px 9px', borderRadius: '6px', border: 'none', cursor: 'pointer',
              background: costFilter===cost ? '#1a1a5a' : '#0f0f2e',
              color: cost ? COST_COLORS[cost] : '#ccc',
              fontSize: '12px', fontWeight: 700,
              boxShadow: costFilter===cost ? `0 0 8px ${cost ? COST_GLOW[cost] : '#4a4aff44'}` : 'none',
              outline: costFilter===cost ? `1px solid ${cost ? COST_COLORS[cost] : '#4a4aff'}` : 'none',
            }}>
              {cost ?? '全'}
            </button>
          ))}
        </div>
      </div>

      {/* 選択中チャンピオンのサムネ列 */}
      {selected.length > 0 && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '4px',
          marginBottom: '14px', padding: '8px 10px',
          background: '#0d0d28', borderRadius: '8px',
          border: '1px solid #2a2a5a',
        }}>
          {selected.map(name => {
            const ch = champions.find(c => c.name === name);
            if (!ch) return null;
            return (
              <div key={name} onClick={() => onToggle(name)} style={{
                width: '36px', height: '36px', borderRadius: '6px',
                overflow: 'hidden', cursor: 'pointer', position: 'relative',
                border: `2px solid ${COST_COLORS[ch.cost]}`,
                flexShrink: 0,
              }}>
                <img
                  src={champImg(ch.ddragon)} alt={name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={e => { (e.target as HTMLImageElement).style.display='none' }}
                />
              </div>
            );
          })}
          <button onClick={() => selected.forEach(onToggle)} style={{
            padding: '4px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
            background: '#1a0a2e', color: '#888', fontSize: '11px', alignSelf: 'center',
          }}>
            全解除
          </button>
        </div>
      )}

      {/* コスト別チャンピオングリッド */}
      {byCost.map(({ cost, champs }) => (
        <div key={cost} style={{ marginBottom: '16px' }}>
          <div style={{
            fontSize: '12px', fontWeight: 700,
            color: COST_COLORS[cost], marginBottom: '8px',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <span style={{
              display: 'inline-block', width: '10px', height: '10px',
              borderRadius: '50%', background: COST_COLORS[cost],
              boxShadow: `0 0 8px ${COST_GLOW[cost]}`,
            }}/>
            {cost}コスト
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {champs.map(ch => {
              const isOn = selected.includes(ch.name);
              return (
                <ChampionTile key={ch.name} champ={ch} selected={isOn} onToggle={onToggle} />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChampionTile({ champ, selected, onToggle }: {
  champ: Champion; selected: boolean; onToggle: (n: string)=>void;
}) {
  const color = COST_COLORS[champ.cost];
  const glow  = COST_GLOW[champ.cost];
  return (
    <div onClick={() => onToggle(champ.name)} style={{
      width: '70px', cursor: 'pointer', userSelect: 'none',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
    }}>
      <div style={{
        width: '70px', height: '70px',
        borderRadius: '10px', overflow: 'hidden',
        border: `2px solid ${selected ? color : '#2a2a4a'}`,
        boxShadow: selected ? `0 0 14px ${glow}, 0 0 4px ${glow}` : 'none',
        position: 'relative',
        transition: 'all .15s',
        background: '#111',
      }}>
        <img
          src={champImg(champ.ddragon)} alt={champ.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            filter: selected ? 'none' : 'grayscale(70%) brightness(0.6)',
            transition: 'filter .15s',
          }}
          onError={e => {
            const el = e.target as HTMLImageElement;
            el.style.display = 'none';
            el.parentElement!.style.display = 'flex';
            el.parentElement!.style.alignItems = 'center';
            el.parentElement!.style.justifyContent = 'center';
            el.parentElement!.innerHTML = `<span style="color:${color};font-size:10px;text-align:center;padding:4px">${champ.name.split(' ').map((w:string)=>w[0]).join('')}</span>`;
          }}
        />
        {selected && (
          <div style={{
            position: 'absolute', top: '4px', right: '4px',
            width: '16px', height: '16px', borderRadius: '50%',
            background: color, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '10px',
          }}>✓</div>
        )}
      </div>
      <span style={{
        fontSize: '10px', textAlign: 'center', lineHeight: 1.2,
        color: selected ? color : '#666',
        fontWeight: selected ? 700 : 400,
        maxWidth: '70px', overflow: 'hidden',
        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {champ.name}
      </span>
    </div>
  );
}
