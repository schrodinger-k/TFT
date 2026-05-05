import { useState } from 'react';
import itemsData from '../../data/items.json';
import augmentsData from '../../data/augments.json';

interface Props {
  selectedItems: string[];
  selectedAugments: string[];
  onToggleItem: (name: string) => void;
  onToggleAugment: (name: string) => void;
}

export default function ItemAugmentSelector({
  selectedItems, selectedAugments, onToggleItem, onToggleAugment
}: Props) {
  const [augSearch, setAugSearch] = useState('');
  const [tab, setTab] = useState<'items' | 'augments'>('augments');

  const filteredAugments = augmentsData.filter(a =>
    a.toLowerCase().includes(augSearch.toLowerCase())
  );

  return (
    <div style={{ padding: '12px' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
        {(['augments', 'items'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
              background: tab === t ? '#4a4aff' : '#2a2a4a',
              color: '#fff', fontWeight: 'bold', fontSize: '13px',
            }}
          >
            {t === 'augments' ? 'オーグメント' : 'アイテム'}
          </button>
        ))}
      </div>

      {tab === 'augments' && (
        <div>
          <div style={{ marginBottom: '8px', color: '#aaa', fontSize: '12px' }}>
            選択済み ({selectedAugments.length}/3):
            {selectedAugments.map(aug => (
              <span
                key={aug}
                onClick={() => onToggleAugment(aug)}
                style={{
                  display: 'inline-block', margin: '2px 4px', padding: '2px 8px',
                  background: '#7c3aed', borderRadius: '4px', color: '#fff',
                  fontSize: '12px', cursor: 'pointer',
                }}
              >
                {aug} ✕
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="オーグメント検索..."
            value={augSearch}
            onChange={e => setAugSearch(e.target.value)}
            style={{
              width: '100%', padding: '8px 12px', marginBottom: '8px',
              background: '#1a1a2e', border: '1px solid #444', borderRadius: '6px',
              color: '#fff', fontSize: '14px', boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
            {filteredAugments.map(aug => {
              const isSelected = selectedAugments.includes(aug);
              const disabled = !isSelected && selectedAugments.length >= 3;
              return (
                <button
                  key={aug}
                  onClick={() => !disabled && onToggleAugment(aug)}
                  style={{
                    padding: '5px 10px', borderRadius: '6px', cursor: disabled ? 'not-allowed' : 'pointer',
                    border: `1px solid ${isSelected ? '#7c3aed' : '#444'}`,
                    background: isSelected ? '#7c3aed33' : '#1a1a2e',
                    color: disabled ? '#555' : isSelected ? '#c084fc' : '#bbb',
                    fontSize: '12px', transition: 'all 0.15s',
                  }}
                >
                  {aug}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'items' && (
        <div>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ color: '#aaa', fontSize: '12px', marginBottom: '6px' }}>コンポーネント</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {itemsData.components.map(item => {
                const isSelected = selectedItems.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => onToggleItem(item)}
                    style={{
                      padding: '6px 10px', borderRadius: '6px', cursor: 'pointer',
                      border: `1px solid ${isSelected ? '#f59e0b' : '#444'}`,
                      background: isSelected ? '#f59e0b22' : '#1a1a2e',
                      color: isSelected ? '#fbbf24' : '#bbb',
                      fontSize: '12px', transition: 'all 0.15s',
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div style={{ color: '#aaa', fontSize: '12px', marginBottom: '6px' }}>完成アイテム</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {itemsData.completed.map(item => {
                const isSelected = selectedItems.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => onToggleItem(item)}
                    style={{
                      padding: '6px 10px', borderRadius: '6px', cursor: 'pointer',
                      border: `1px solid ${isSelected ? '#34d399' : '#444'}`,
                      background: isSelected ? '#34d39922' : '#1a1a2e',
                      color: isSelected ? '#6ee7b7' : '#bbb',
                      fontSize: '12px', transition: 'all 0.15s',
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
