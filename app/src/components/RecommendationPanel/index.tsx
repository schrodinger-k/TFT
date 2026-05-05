import type { CompScore } from '../../types/comp';

interface Props {
  scores: CompScore[];
  loading?: boolean;
}

const STYLE_LABELS: Record<string, string> = {
  reroll: '🔁 リロール',
  carry: '⚔️ キャリー',
  fast9: '🚀 Fast 9',
};

const STYLE_COLORS: Record<string, string> = {
  reroll: '#06b6d4',
  carry: '#ef4444',
  fast9: '#f59e0b',
};

export default function RecommendationPanel({ scores }: Props) {
  if (scores.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#666' }}>
        チャンピオン・アイテム・オーグメントを選択すると<br />最適な構成が表示されます
      </div>
    );
  }

  const top3 = scores.slice(0, 3);
  const rest = scores.slice(3);

  return (
    <div style={{ padding: '12px' }}>
      <div style={{ color: '#aaa', fontSize: '12px', marginBottom: '12px' }}>
        スコアに基づく構成推薦（Sティア / Patch 17.2b）
      </div>

      {top3.map((score, idx) => (
        <CompCard key={score.comp.id} score={score} rank={idx + 1} highlight={idx === 0} />
      ))}

      {rest.length > 0 && (
        <details style={{ marginTop: '8px' }}>
          <summary style={{ color: '#666', cursor: 'pointer', fontSize: '13px', padding: '4px' }}>
            他の構成を見る ({rest.length}件)
          </summary>
          {rest.map((score, idx) => (
            <CompCard key={score.comp.id} score={score} rank={idx + 4} highlight={false} />
          ))}
        </details>
      )}
    </div>
  );
}

function CompCard({ score, rank, highlight }: { score: CompScore; rank: number; highlight: boolean }) {
  const { comp, totalScore, championScore, augmentScore, itemScore, matchedEarlyUnits, recommendation } = score;

  const recColor = recommendation === '狙い目！' ? '#22c55e'
    : recommendation === '有力な選択肢' ? '#f59e0b'
    : '#6b7280';

  return (
    <div style={{
      marginBottom: '12px',
      padding: '14px',
      background: highlight ? '#1a1a3e' : '#111128',
      border: `1px solid ${highlight ? '#4a4aff' : '#2a2a4a'}`,
      borderRadius: '10px',
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '24px', height: '24px', borderRadius: '50%',
            background: rank === 1 ? '#ffd700' : rank === 2 ? '#c0c0c0' : '#cd7f32',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 'bold', color: '#000', flexShrink: 0,
          }}>
            {rank}
          </span>
          <div>
            <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '15px' }}>{comp.name}</div>
            <div style={{ fontSize: '11px', color: STYLE_COLORS[comp.style] }}>
              {STYLE_LABELS[comp.style]}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: recColor }}>{totalScore}</div>
          <div style={{ fontSize: '11px', color: recColor }}>{recommendation}</div>
        </div>
      </div>

      {/* スコアバー */}
      <div style={{ marginBottom: '10px' }}>
        {[
          { label: 'チャンプ', value: championScore, max: 50, color: '#4a4aff' },
          { label: 'オーグメント', value: augmentScore, max: 30, color: '#7c3aed' },
          { label: 'アイテム', value: itemScore, max: 20, color: '#f59e0b' },
        ].map(({ label, value, max, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
            <div style={{ width: '70px', fontSize: '11px', color: '#888', flexShrink: 0 }}>{label}</div>
            <div style={{ flex: 1, height: '6px', background: '#2a2a4a', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                width: `${(value / max) * 100}%`, height: '100%',
                background: color, borderRadius: '3px', transition: 'width 0.3s',
              }} />
            </div>
            <div style={{ width: '30px', fontSize: '11px', color: '#aaa', textAlign: 'right' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* 序盤ヒント */}
      {matchedEarlyUnits.length > 0 && (
        <div style={{
          padding: '8px 10px', background: '#0f2a1f', borderRadius: '6px',
          border: '1px solid #22c55e44', marginBottom: '8px',
        }}>
          <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: 'bold' }}>🎯 早期マッチ: </span>
          <span style={{ color: '#86efac', fontSize: '12px' }}>
            {matchedEarlyUnits.join('・')} を所持！
          </span>
        </div>
      )}

      {/* 構成メモ */}
      <div style={{ color: '#888', fontSize: '12px', lineHeight: '1.5' }}>
        💡 {comp.notes}
      </div>

      {/* キャリーとBISアイテム */}
      <details style={{ marginTop: '8px' }}>
        <summary style={{ color: '#555', cursor: 'pointer', fontSize: '12px' }}>
          詳細を見る（BISアイテム・オーグメント）
        </summary>
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #2a2a4a' }}>
          <div style={{ marginBottom: '6px' }}>
            <span style={{ color: '#aaa', fontSize: '11px' }}>BISアイテム: </span>
            {comp.items.slice(0, 3).map(item => (
              <span key={item.name} style={{
                display: 'inline-block', margin: '2px', padding: '2px 6px',
                background: '#1a2a1a', borderRadius: '4px', color: '#6ee7b7', fontSize: '11px',
              }}>
                {item.name} ({item.target})
              </span>
            ))}
          </div>
          <div>
            <span style={{ color: '#aaa', fontSize: '11px' }}>推奨オーグメント: </span>
            {comp.augments.filter(a => a.priority === 'HIGH').map(aug => (
              <span key={aug.name} style={{
                display: 'inline-block', margin: '2px', padding: '2px 6px',
                background: '#1a0a2e', borderRadius: '4px', color: '#c084fc', fontSize: '11px',
              }}>
                {aug.name}
              </span>
            ))}
          </div>
        </div>
      </details>
    </div>
  );
}
