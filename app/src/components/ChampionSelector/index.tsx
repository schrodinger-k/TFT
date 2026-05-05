import { useState } from 'react';
import championsData from '../../data/champions.json';

interface Champion {
  name: string;
  cost: 1 | 2 | 3 | 4 | 5;
  traits: string[];
}

interface Props {
  selected: string[];
  onToggle: (name: string) => void;
}

const COST_COLORS: Record<number, string> = {
  1: '#9e9e9e',
  2: '#4caf50',
  3: '#2196f3',
  4: '#9c27b0',
  5: '#ffc107',
};

const champions = championsData as Champion[];

export default function ChampionSelector({ selected, onToggle }: Props) {
  const [search, setSearch] = useState('');
  const [costFilter, setCostFilter] = useState<number | null>(null);

  const filtered = champions.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchCost = costFilter === null || c.cost === costFilter;
    return matchSearch && matchCost;
  });

  const grouped = [1, 2, 3, 4, 5].map(cost => ({
    cost,
    champs: filtered.filter(c => c.cost === cost),
  })).filter(g => g.champs.length > 0);

  return (
    <div style={{ padding: '12px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="チャンピオン検索..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: '120px', padding: '8px 12px',
            background: '#1a1a2e', border: '1px solid #444', borderRadius: '6px',
            color: '#fff', fontSize: '14px',
          }}
        />
        <div style={{ display: 'flex', gap: '4px' }}>
          {[null, 1, 2, 3, 4, 5].map(cost => (
            <button
              key={cost ?? 'all'}
              onClick={() => setCostFilter(cost)}
              style={{
                padding: '6px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                background: costFilter === cost ? '#4a4aff' : '#2a2a4a',
                color: cost ? COST_COLORS[cost] : '#fff',
                fontWeight: 'bold', fontSize: '13px',
              }}
            >
              {cost ?? '全'}
            </button>
          ))}
        </div>
      </div>

      {selected.length > 0 && (
        <div style={{ marginBottom: '12px', padding: '8px', background: '#1a1a3e', borderRadius: '6px' }}>
          <span style={{ color: '#aaa', fontSize: '12px' }}>選択中: </span>
          {selected.map(name => (
            <span
              key={name}
              onClick={() => onToggle(name)}
              style={{
                display: 'inline-block', margin: '2px', padding: '2px 8px',
                background: '#4a4aff', borderRadius: '4px', color: '#fff',
                fontSize: '12px', cursor: 'pointer',
              }}
            >
              {name} ✕
            </span>
          ))}
        </div>
      )}

      {grouped.map(({ cost, champs }) => (
        <div key={cost} style={{ marginBottom: '12px' }}>
          <div style={{ color: COST_COLORS[cost], fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
            {cost}コスト
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {champs.map(champ => {
              const isSelected = selected.includes(champ.name);
              return (
                <button
                  key={champ.name}
                  onClick={() => onToggle(champ.name)}
                  style={{
                    padding: '6px 10px', borderRadius: '8px', cursor: 'pointer',
                    border: `2px solid ${isSelected ? COST_COLORS[cost] : '#333'}`,
                    background: isSelected ? `${COST_COLORS[cost]}22` : '#1a1a2e',
                    color: isSelected ? COST_COLORS[cost] : '#ccc',
                    fontSize: '13px', transition: 'all 0.15s',
                    fontWeight: isSelected ? 'bold' : 'normal',
                  }}
                >
                  {champ.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
