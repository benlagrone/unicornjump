import React, { useState } from 'react';
import {
  getCloseSettingsTitle,
  getDifficultyLabelHaiku,
  getDifficultyOptionTitle,
  getDifficultyTitle,
  getMusicLabelHaiku,
  getMusicTitle,
  getSaveSettingsTitle,
  getSettingsIntroHaiku,
  getSettingsTitle,
  getSoundLabelHaiku,
  getSoundTitle,
  toHaikuText,
} from './haikuText';

const cardStyle = {
  background: 'rgba(255, 249, 240, 0.94)',
  border: '1px solid rgba(255, 255, 255, 0.72)',
  borderRadius: 28,
  boxShadow: '0 24px 65px rgba(15, 23, 42, 0.22)',
  backdropFilter: 'blur(12px)',
};

const haikuBlockStyle = {
  whiteSpace: 'pre-line',
  lineHeight: 1.24,
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
          width: 'min(540px, calc(100vw - 32px))',
          maxHeight: 'calc(100dvh - 32px)',
          overflowY: 'auto',
          padding: '28px 24px',
          color: '#17345c',
        }}
      >
        <h2
          style={{
            fontSize: 34,
            margin: '0 0 10px',
          }}
        >
          {getSettingsTitle()}
        </h2>
        <div style={{ ...haikuBlockStyle, fontSize: 16, margin: '0 0 16px' }}>
          {toHaikuText(getSettingsIntroHaiku())}
        </div>

        <div style={{ display: 'grid', gap: 14 }}>
          <label
            style={{
              display: 'grid',
              gap: 10,
              background: 'rgba(255,255,255,0.62)',
              borderRadius: 18,
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={() => setSoundEnabled(!soundEnabled)}
              />
              <span style={{ fontSize: 16, fontWeight: 700 }}>{getSoundTitle()}</span>
            </div>
            <span style={{ ...haikuBlockStyle, fontSize: 14, paddingLeft: 28 }}>
              {toHaikuText(getSoundLabelHaiku())}
            </span>
          </label>

          <label
            style={{
              display: 'grid',
              gap: 10,
              background: 'rgba(255,255,255,0.62)',
              borderRadius: 18,
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="checkbox"
                checked={musicEnabled}
                onChange={() => setMusicEnabled(!musicEnabled)}
              />
              <span style={{ fontSize: 16, fontWeight: 700 }}>{getMusicTitle()}</span>
            </div>
            <span style={{ ...haikuBlockStyle, fontSize: 14, paddingLeft: 28 }}>
              {toHaikuText(getMusicLabelHaiku())}
            </span>
          </label>

          <div
            style={{
              display: 'grid',
              gap: 8,
              background: 'rgba(255,255,255,0.62)',
              borderRadius: 18,
              padding: '12px 14px',
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 700 }}>{getDifficultyTitle()}</span>
            <span style={{ ...haikuBlockStyle, fontSize: 14 }}>
              {toHaikuText(getDifficultyLabelHaiku())}
            </span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 10,
              }}
            >
              {['gentle', 'normal', 'adventurous'].map((option) => {
                const isSelected = difficulty === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setDifficulty(option)}
                    style={{
                      borderRadius: 18,
                      border: isSelected
                        ? '2px solid #2563eb'
                        : '1px solid rgba(23, 52, 92, 0.16)',
                      padding: '12px 10px',
                      fontSize: 14,
                      fontWeight: 700,
                      lineHeight: 1.15,
                      textAlign: 'center',
                      background: isSelected ? 'rgba(219, 234, 254, 0.8)' : '#fff',
                      color: '#17345c',
                      cursor: 'pointer',
                    }}
                  >
                    {getDifficultyOptionTitle(option)}
                  </button>
                );
              })}
            </div>
          </div>
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
              whiteSpace: 'pre-line',
              lineHeight: 1.1,
              textAlign: 'center',
            }}
          >
            {getCloseSettingsTitle()}
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
              whiteSpace: 'pre-line',
              lineHeight: 1.1,
              textAlign: 'center',
            }}
          >
            {getSaveSettingsTitle()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
