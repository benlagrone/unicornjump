import React, { useState } from 'react';

const cardStyle = {
  background: 'rgba(255, 249, 240, 0.94)',
  border: '1px solid rgba(255, 255, 255, 0.72)',
  borderRadius: 28,
  boxShadow: '0 24px 65px rgba(15, 23, 42, 0.22)',
  backdropFilter: 'blur(12px)',
};

const Settings = ({ initialSettings, onClose, onSave }) => {
  const [soundEnabled, setSoundEnabled] = useState(initialSettings?.soundEnabled ?? true);
  const [musicEnabled, setMusicEnabled] = useState(initialSettings?.musicEnabled ?? true);
  const [difficulty, setDifficulty] = useState(initialSettings?.difficulty ?? 'gentle');

  const handleSave = () => {
    onSave({ soundEnabled, musicEnabled, difficulty });
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background: 'rgba(15, 23, 42, 0.34)',
      }}
    >
      <div
        style={{
          ...cardStyle,
          width: 'min(460px, calc(100vw - 32px))',
          padding: '28px 24px',
          color: '#17345c',
        }}
      >
        <h2 style={{ fontSize: 36, margin: '0 0 16px' }}>Settings</h2>

        <div style={{ display: 'grid', gap: 14 }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(255,255,255,0.62)',
              borderRadius: 18,
              padding: '12px 14px',
            }}
          >
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={() => setSoundEnabled(!soundEnabled)}
            />
            <span>Sound Effects</span>
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(255,255,255,0.62)',
              borderRadius: 18,
              padding: '12px 14px',
            }}
          >
            <input
              type="checkbox"
              checked={musicEnabled}
              onChange={() => setMusicEnabled(!musicEnabled)}
            />
            <span>Background Music</span>
          </label>

          <label
            style={{
              display: 'grid',
              gap: 8,
              background: 'rgba(255,255,255,0.62)',
              borderRadius: 18,
              padding: '12px 14px',
            }}
          >
            <span>Difficulty</span>
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
              style={{
                borderRadius: 14,
                border: '1px solid rgba(23, 52, 92, 0.16)',
                padding: '10px 12px',
                fontSize: 16,
                background: '#fff',
              }}
            >
              <option value="gentle">Gentle</option>
              <option value="normal">Normal</option>
              <option value="adventurous">Adventurous</option>
            </select>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
          <button
            onClick={onClose}
            style={{
              border: 0,
              borderRadius: 999,
              padding: '12px 18px',
              fontSize: 16,
              fontWeight: 700,
              background: '#ffffff',
              color: '#17345c',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              border: 0,
              borderRadius: 999,
              padding: '12px 18px',
              fontSize: 16,
              fontWeight: 700,
              background: '#2563eb',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
