import React, { useEffect, useRef, useState } from 'react';
import { getHouseById } from './builderState';

const panelStyle = {
  background: 'rgba(255, 249, 240, 0.82)',
  border: '1px solid rgba(255, 255, 255, 0.7)',
  borderRadius: 30,
  boxShadow: '0 24px 65px rgba(15, 23, 42, 0.22)',
  backdropFilter: 'blur(12px)',
};

const buttonStyle = (background, color = '#17345c') => ({
  border: 0,
  borderRadius: 999,
  padding: '12px 18px',
  minHeight: 54,
  fontSize: 15,
  fontWeight: 700,
  background,
  color,
  cursor: 'pointer',
});

const getHouseArtPalette = (entry) => ({
  wallColor: entry?.palette?.wallColor ?? entry?.wallColor ?? '#f7f1e7',
  roofColor: entry?.palette?.roofColor ?? entry?.roofColor ?? '#34435a',
  trimColor: entry?.palette?.trimColor ?? entry?.trimColor ?? '#7c593e',
  glowColor: entry?.palette?.glowColor ?? entry?.glowColor ?? 'rgba(244, 180, 87, 0.22)',
  accentColor: entry?.roomTheme?.accent ?? entry?.trimColor ?? '#f4b457',
});

const getHouseArtTypeId = (entry) => entry?.typeId ?? entry?.id ?? 'generic-house';

const getWorldScene = (entry) => {
  const palette = getHouseArtPalette(entry);
  const fallback = {
    boardBackground:
      'linear-gradient(180deg, rgba(235, 248, 255, 0.98) 0%, rgba(238, 252, 239, 0.94) 48%, rgba(196, 233, 202, 0.92) 100%)',
    boardGlow: 'radial-gradient(circle at 50% 8%, rgba(255,255,255,0.96), rgba(255,255,255,0) 62%)',
    tileBackground:
      'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(231, 248, 235, 0.96))',
    tileBorder: 'rgba(23, 52, 92, 0.12)',
    chipBackground: 'rgba(255,255,255,0.88)',
    titleColor: '#17345c',
    subtitleColor: 'rgba(23, 52, 92, 0.72)',
    plusBackground: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245, 248, 255, 0.92))',
  };

  const scenes = {
    'korean-garden-court': {
      boardBackground:
        'linear-gradient(180deg, rgba(215, 237, 247, 0.98) 0%, rgba(232, 246, 238, 0.95) 42%, rgba(189, 223, 196, 0.94) 100%)',
      boardGlow: 'radial-gradient(circle at 62% 12%, rgba(255,245,202,0.88), rgba(255,255,255,0) 54%)',
      tileBackground:
        'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(227, 243, 234, 0.94) 56%, rgba(201, 233, 213, 0.96) 100%)',
      tileBorder: 'rgba(52, 67, 90, 0.18)',
      chipBackground: 'rgba(255, 249, 232, 0.92)',
      titleColor: '#27465f',
      subtitleColor: 'rgba(39, 70, 95, 0.74)',
      plusBackground: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247, 241, 218, 0.94))',
    },
    'fantasy-bavarian-castle': {
      boardBackground:
        'linear-gradient(180deg, rgba(218, 226, 255, 0.98) 0%, rgba(241, 244, 255, 0.94) 40%, rgba(217, 232, 250, 0.94) 100%)',
      boardGlow: 'radial-gradient(circle at 50% 6%, rgba(255,236,194,0.72), rgba(255,255,255,0) 56%)',
      tileBackground:
        'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(238, 240, 255, 0.95) 54%, rgba(215, 228, 248, 0.96) 100%)',
      tileBorder: 'rgba(67, 80, 127, 0.18)',
      chipBackground: 'rgba(255, 245, 235, 0.9)',
      titleColor: '#31446f',
      subtitleColor: 'rgba(49, 68, 111, 0.74)',
      plusBackground: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(246, 236, 228, 0.94))',
    },
    'spanish-palace-suite': {
      boardBackground:
        'linear-gradient(180deg, rgba(255, 227, 203, 0.98) 0%, rgba(255, 241, 223, 0.95) 38%, rgba(245, 219, 185, 0.94) 100%)',
      boardGlow: 'radial-gradient(circle at 50% 8%, rgba(255,244,211,0.76), rgba(255,255,255,0) 58%)',
      tileBackground:
        'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255, 243, 233, 0.95) 54%, rgba(248, 225, 198, 0.96) 100%)',
      tileBorder: 'rgba(161, 79, 50, 0.18)',
      chipBackground: 'rgba(255, 247, 237, 0.9)',
      titleColor: '#8f4d32',
      subtitleColor: 'rgba(143, 77, 50, 0.72)',
      plusBackground: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255, 235, 214, 0.94))',
    },
    'mesoamerican-pyramid-room': {
      boardBackground:
        'linear-gradient(180deg, rgba(255, 213, 162, 0.98) 0%, rgba(255, 232, 190, 0.95) 36%, rgba(210, 183, 118, 0.94) 100%)',
      boardGlow: 'radial-gradient(circle at 52% 6%, rgba(255,235,151,0.68), rgba(255,255,255,0) 54%)',
      tileBackground:
        'linear-gradient(180deg, rgba(255,248,238,0.98), rgba(240, 219, 180, 0.95) 54%, rgba(215, 183, 124, 0.96) 100%)',
      tileBorder: 'rgba(124, 83, 46, 0.22)',
      chipBackground: 'rgba(255, 245, 222, 0.9)',
      titleColor: '#6f472c',
      subtitleColor: 'rgba(111, 71, 44, 0.72)',
      plusBackground: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(249, 229, 188, 0.94))',
    },
    'grecoroman-circus-hall': {
      boardBackground:
        'linear-gradient(180deg, rgba(219, 233, 251, 0.98) 0%, rgba(244, 245, 240, 0.95) 42%, rgba(226, 213, 189, 0.94) 100%)',
      boardGlow: 'radial-gradient(circle at 48% 8%, rgba(255,255,255,0.76), rgba(255,255,255,0) 56%)',
      tileBackground:
        'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244, 241, 233, 0.95) 54%, rgba(229, 216, 195, 0.96) 100%)',
      tileBorder: 'rgba(107, 124, 167, 0.18)',
      chipBackground: 'rgba(255, 249, 241, 0.9)',
      titleColor: '#485985',
      subtitleColor: 'rgba(72, 89, 133, 0.72)',
      plusBackground: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245, 237, 228, 0.94))',
    },
    'scandinavian-longhouse': {
      boardBackground:
        'linear-gradient(180deg, rgba(218, 228, 237, 0.98) 0%, rgba(241, 236, 225, 0.95) 40%, rgba(194, 164, 139, 0.94) 100%)',
      boardGlow: 'radial-gradient(circle at 52% 8%, rgba(255,228,183,0.48), rgba(255,255,255,0) 56%)',
      tileBackground:
        'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(240, 233, 223, 0.95) 54%, rgba(211, 191, 171, 0.96) 100%)',
      tileBorder: 'rgba(74, 52, 38, 0.2)',
      chipBackground: 'rgba(249, 242, 233, 0.9)',
      titleColor: '#50392b',
      subtitleColor: 'rgba(80, 57, 43, 0.72)',
      plusBackground: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(239, 229, 214, 0.94))',
    },
    'japanese-fortress': {
      boardBackground:
        'linear-gradient(180deg, rgba(220, 233, 247, 0.98) 0%, rgba(242, 239, 235, 0.95) 40%, rgba(223, 210, 205, 0.94) 100%)',
      boardGlow: 'radial-gradient(circle at 70% 10%, rgba(255,255,255,0.76), rgba(255,255,255,0) 56%)',
      tileBackground:
        'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244, 239, 235, 0.95) 54%, rgba(226, 215, 206, 0.96) 100%)',
      tileBorder: 'rgba(47, 64, 91, 0.18)',
      chipBackground: 'rgba(255, 246, 247, 0.9)',
      titleColor: '#31425f',
      subtitleColor: 'rgba(49, 66, 95, 0.72)',
      plusBackground: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247, 236, 239, 0.94))',
    },
    'babylonian-hanging-gardens': {
      boardBackground:
        'linear-gradient(180deg, rgba(216, 240, 225, 0.98) 0%, rgba(240, 246, 231, 0.95) 38%, rgba(207, 193, 143, 0.94) 100%)',
      boardGlow: 'radial-gradient(circle at 42% 8%, rgba(230,255,214,0.52), rgba(255,255,255,0) 56%)',
      tileBackground:
        'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(234, 245, 229, 0.95) 54%, rgba(215, 206, 168, 0.96) 100%)',
      tileBorder: 'rgba(70, 125, 109, 0.18)',
      chipBackground: 'rgba(244, 248, 235, 0.9)',
      titleColor: '#447261',
      subtitleColor: 'rgba(68, 114, 97, 0.72)',
      plusBackground: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(232, 245, 224, 0.94))',
    },
    'future-sky-dome': {
      boardBackground:
        'linear-gradient(180deg, rgba(18, 31, 68, 0.98) 0%, rgba(41, 62, 120, 0.96) 42%, rgba(115, 136, 190, 0.94) 100%)',
      boardGlow: 'radial-gradient(circle at 48% 8%, rgba(133,241,255,0.44), rgba(255,255,255,0) 56%)',
      tileBackground:
        'linear-gradient(180deg, rgba(242, 248, 255, 0.98), rgba(216, 230, 250, 0.95) 54%, rgba(177, 197, 233, 0.96) 100%)',
      tileBorder: 'rgba(63, 95, 168, 0.24)',
      chipBackground: 'rgba(237, 247, 255, 0.9)',
      titleColor: '#21407a',
      subtitleColor: 'rgba(33, 64, 122, 0.72)',
      plusBackground: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(224, 241, 255, 0.94))',
    },
  };

  return {
    ...fallback,
    ...(scenes[getHouseArtTypeId(entry)] || {}),
    palette,
  };
};

const renderHouseArt = (entry, palette) => {
  const typeId = getHouseArtTypeId(entry);
  const wall = palette.wallColor;
  const roof = palette.roofColor;
  const trim = palette.trimColor;
  const accent = palette.accentColor;

  if (typeId === 'korean-garden-court') {
    return (
      <>
        <rect x="22" y="58" width="76" height="28" rx="8" fill={wall} stroke={trim} strokeWidth="4" />
        <path d="M18 58 Q60 24 102 58 L96 64 Q60 40 24 64 Z" fill={roof} />
        <circle cx="60" cy="74" r="13" fill="#f5e8ce" stroke={trim} strokeWidth="4" />
        <circle cx="60" cy="74" r="6" stroke={trim} strokeWidth="3" />
        <rect x="28" y="60" width="8" height="24" rx="4" fill={trim} />
        <rect x="84" y="60" width="8" height="24" rx="4" fill={trim} />
        {[26, 34, 42].map((x) => (
          <rect key={`bamboo-${x}`} x={x} y="46" width="4" height="32" rx="2" fill="#5f9a79" />
        ))}
        <circle cx="92" cy="68" r="5" fill={accent} opacity="0.9" />
      </>
    );
  }

  if (typeId === 'fantasy-bavarian-castle') {
    return (
      <>
        <rect x="18" y="42" width="18" height="40" rx="6" fill={wall} stroke={trim} strokeWidth="4" />
        <rect x="84" y="42" width="18" height="40" rx="6" fill={wall} stroke={trim} strokeWidth="4" />
        <path d="M14 44 L27 24 L40 44 Z" fill={roof} />
        <path d="M80 44 L93 24 L106 44 Z" fill={roof} />
        <rect x="34" y="54" width="52" height="30" rx="8" fill={wall} stroke={trim} strokeWidth="4" />
        <path d="M30 56 L60 34 L90 56 Z" fill={roof} />
        {[24, 90].map((x) => (
          <rect key={`window-${x}`} x={x} y="54" width="6" height="12" rx="3" fill="#d7defa" />
        ))}
        {[48, 66].map((x) => (
          <rect key={`hall-window-${x}`} x={x} y="60" width="8" height="10" rx="4" fill="#d7defa" />
        ))}
        <path d="M50 84 Q60 68 70 84 Z" fill="#f6d2a0" stroke={trim} strokeWidth="3" />
        <path d="M28 34 L28 52" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        <path d="M92 34 L92 52" stroke={accent} strokeWidth="4" strokeLinecap="round" />
      </>
    );
  }

  if (typeId === 'spanish-palace-suite') {
    return (
      <>
        <rect x="18" y="54" width="84" height="28" rx="8" fill={wall} stroke={trim} strokeWidth="4" />
        <ellipse cx="60" cy="42" rx="14" ry="10" fill={roof} />
        <rect x="52" y="28" width="16" height="16" rx="6" fill={wall} stroke={trim} strokeWidth="3" />
        {[30, 52, 74].map((x) => (
          <path
            key={`arch-${x}`}
            d={`M${x} 82 V66 Q${x + 8} 54 ${x + 16} 66 V82`}
            stroke={trim}
            strokeWidth="4"
            fill="rgba(255,255,255,0.2)"
          />
        ))}
        <rect x="20" y="46" width="8" height="16" rx="4" fill={wall} stroke={trim} strokeWidth="3" />
        <rect x="92" y="46" width="8" height="16" rx="4" fill={wall} stroke={trim} strokeWidth="3" />
        <circle cx="60" cy="90" r="7" fill={accent} opacity="0.9" />
        <path d="M60 80 L60 92" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      </>
    );
  }

  if (typeId === 'mesoamerican-pyramid-room') {
    return (
      <>
        <circle cx="90" cy="24" r="10" fill={accent} opacity="0.95" />
        <path d="M28 84 H92 L84 72 H36 Z" fill="#b88350" stroke={trim} strokeWidth="4" />
        <path d="M34 72 H86 L78 60 H42 Z" fill="#c99863" stroke={trim} strokeWidth="4" />
        <path d="M42 60 H78 L70 48 H50 Z" fill="#d8b27b" stroke={trim} strokeWidth="4" />
        <rect x="52" y="38" width="16" height="12" rx="2" fill={wall} stroke={trim} strokeWidth="3" />
        <path d="M56 50 V84" stroke={trim} strokeWidth="3" strokeLinecap="round" />
        <path d="M64 50 V84" stroke={trim} strokeWidth="3" strokeLinecap="round" />
      </>
    );
  }

  if (typeId === 'grecoroman-circus-hall') {
    return (
      <>
        <path d="M18 84 Q60 38 102 84 V92 H18 Z" fill={wall} stroke={trim} strokeWidth="4" />
        {[28, 44, 60, 76, 92].map((x) => (
          <rect key={`column-${x}`} x={x - 3} y="54" width="6" height="26" rx="3" fill="#f6efe4" stroke={trim} strokeWidth="2" />
        ))}
        <path d="M18 84 Q60 38 102 84" stroke={roof} strokeWidth="5" fill="none" />
        <ellipse cx="60" cy="88" rx="28" ry="8" fill={accent} opacity="0.22" />
        {[24, 40, 56, 72, 88].map((x) => (
          <path key={`garland-${x}`} d={`M${x} 46 L${x + 8} 56 L${x + 16} 46`} fill={accent} opacity="0.9" />
        ))}
      </>
    );
  }

  if (typeId === 'scandinavian-longhouse') {
    return (
      <>
        <rect x="16" y="58" width="88" height="22" rx="6" fill={wall} stroke={trim} strokeWidth="4" />
        <path d="M10 58 L60 26 L110 58 L100 64 L60 38 L20 64 Z" fill={roof} />
        {[28, 44, 60, 76, 92].map((x) => (
          <rect key={`beam-${x}`} x={x - 2} y="58" width="4" height="22" rx="2" fill={trim} />
        ))}
        <circle cx="40" cy="70" r="7" fill="#d7c0a3" stroke={trim} strokeWidth="3" />
        <circle cx="80" cy="70" r="7" fill="#d7c0a3" stroke={trim} strokeWidth="3" />
        <path d="M55 84 L65 84" stroke={accent} strokeWidth="4" strokeLinecap="round" />
      </>
    );
  }

  if (typeId === 'japanese-fortress') {
    return (
      <>
        <rect x="30" y="68" width="60" height="18" rx="4" fill={wall} stroke={trim} strokeWidth="4" />
        <path d="M22 68 L60 56 L98 68 Z" fill={roof} />
        <rect x="38" y="52" width="44" height="14" rx="4" fill={wall} stroke={trim} strokeWidth="3" />
        <path d="M30 52 L60 42 L90 52 Z" fill={roof} />
        <rect x="46" y="38" width="28" height="10" rx="3" fill={wall} stroke={trim} strokeWidth="3" />
        <path d="M40 38 L60 30 L80 38 Z" fill={roof} />
        {[44, 60, 76].map((x) => (
          <rect key={`shoji-${x}`} x={x - 1} y="54" width="2" height="26" fill={trim} opacity="0.55" />
        ))}
        <circle cx="90" cy="36" r="5" fill={accent} opacity="0.85" />
      </>
    );
  }

  if (typeId === 'babylonian-hanging-gardens') {
    return (
      <>
        <rect x="18" y="68" width="44" height="16" rx="4" fill="#b88d58" stroke={trim} strokeWidth="4" />
        <rect x="40" y="52" width="42" height="16" rx="4" fill="#c6a46e" stroke={trim} strokeWidth="4" />
        <rect x="60" y="36" width="28" height="14" rx="4" fill="#d8c495" stroke={trim} strokeWidth="4" />
        {[26, 48, 68].map((x) => (
          <path key={`vine-${x}`} d={`M${x} 36 C${x - 4} 52 ${x + 6} 64 ${x} 84`} stroke="#6ed39a" strokeWidth="4" strokeLinecap="round" fill="none" />
        ))}
        {[28, 46, 64].map((x) => (
          <path key={`arch-${x}`} d={`M${x} 84 V74 Q${x + 6} 68 ${x + 12} 74 V84`} stroke={trim} strokeWidth="3" fill="rgba(255,255,255,0.14)" />
        ))}
        <circle cx="94" cy="44" r="5" fill={accent} opacity="0.92" />
      </>
    );
  }

  if (typeId === 'future-sky-dome') {
    return (
      <>
        <path d="M20 84 Q60 26 100 84" stroke={roof} strokeWidth="6" fill="none" />
        <path d="M20 84 H100 V92 H20 Z" fill={wall} stroke={trim} strokeWidth="4" />
        <path d="M30 84 V50 M48 84 V42 M72 84 V42 M90 84 V50" stroke={trim} strokeWidth="3" opacity="0.42" />
        <ellipse cx="60" cy="88" rx="26" ry="8" fill={accent} opacity="0.22" />
        {[28, 44, 60, 76, 92].map((x, index) => (
          <circle key={`star-${x}`} cx={x} cy={index % 2 === 0 ? 44 : 34} r={index % 2 === 0 ? 3 : 2.5} fill="#f8fcff" />
        ))}
        <rect x="50" y="66" width="20" height="10" rx="5" fill={wall} stroke={trim} strokeWidth="3" />
        <rect x="24" y="72" width="12" height="16" rx="6" fill="#b2c7f1" stroke={trim} strokeWidth="3" />
        <rect x="84" y="72" width="12" height="16" rx="6" fill="#b2c7f1" stroke={trim} strokeWidth="3" />
      </>
    );
  }

  return (
    <>
      <rect x="22" y="58" width="76" height="28" rx="8" fill={wall} stroke={trim} strokeWidth="4" />
      <path d="M18 58 L60 30 L102 58 Z" fill={roof} />
      <rect x="52" y="66" width="16" height="20" rx="5" fill="#f5c98a" stroke={trim} strokeWidth="3" />
    </>
  );
};

const HouseArt = ({ entry, size = 88, showBadge = true }) => {
  if (!entry) {
    return null;
  }

  const palette = getHouseArtPalette(entry);

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '8%',
          borderRadius: '50%',
          background: `radial-gradient(circle at 50% 42%, rgba(255,255,255,0.96), ${palette.glowColor})`,
          opacity: 0.92,
        }}
      />
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        style={{
          display: 'block',
          position: 'relative',
          zIndex: 1,
          overflow: 'visible',
          filter: 'drop-shadow(0 6px 8px rgba(15, 23, 42, 0.14))',
        }}
      >
        {renderHouseArt(entry, palette)}
      </svg>
      {showBadge && (
        <div
          style={{
            position: 'absolute',
            right: 4,
            top: 2,
            minWidth: 28,
            padding: '3px 7px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.88)',
            color: palette.trimColor,
            fontSize: 10,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: 0.7,
            textAlign: 'center',
            zIndex: 2,
          }}
        >
          {entry.shortLabel}
        </div>
      )}
    </div>
  );
};

const renderWorldFeatureArt = (entry, palette) => {
  const typeId = getHouseArtTypeId(entry);
  const accent = palette.accentColor;
  const roof = palette.roofColor;
  const trim = palette.trimColor;
  const wall = palette.wallColor;

  if (typeId === 'korean-garden-court') {
    return (
      <>
        {[24, 58, 94, 130, 170, 210].map((x, index) => (
          <path
            key={`bamboo-${x}`}
            d={`M${x} 34 C${x - 4} 68 ${x + 6} 104 ${x} 136`}
            stroke={index % 2 === 0 ? '#67a17e' : '#4e836c'}
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            opacity="0.82"
          />
        ))}
        <circle cx="180" cy="58" r="34" fill="rgba(255,255,255,0.56)" stroke={roof} strokeWidth="8" />
        <path d="M52 114 H144 L132 96 H64 Z" fill={wall} stroke={trim} strokeWidth="6" />
        <path d="M44 98 Q98 42 152 98" fill="none" stroke={roof} strokeWidth="12" strokeLinecap="round" />
        <ellipse cx="184" cy="126" rx="46" ry="20" fill="rgba(116, 198, 214, 0.34)" />
        {[150, 170, 190, 210].map((x) => (
          <circle key={`stone-${x}`} cx={x} cy={136} r="7" fill="rgba(255,255,255,0.72)" />
        ))}
        <circle cx="56" cy="92" r="8" fill={accent} opacity="0.88" />
      </>
    );
  }

  if (typeId === 'fantasy-bavarian-castle') {
    return (
      <>
        {[20, 62, 108, 154, 202].map((x, index) => (
          <path
            key={`alp-${x}`}
            d={`M${x - 22} 124 L${x} ${54 + (index % 2) * 14} L${x + 28} 124 Z`}
            fill={index % 2 === 0 ? 'rgba(111, 126, 175, 0.28)' : 'rgba(86, 101, 149, 0.2)'}
          />
        ))}
        <rect x="54" y="92" width="132" height="28" rx="10" fill={wall} stroke={trim} strokeWidth="6" />
        {[62, 168].map((x) => (
          <g key={`tower-${x}`}>
            <rect x={x} y="66" width="30" height="54" rx="8" fill={wall} stroke={trim} strokeWidth="6" />
            <path d={`M${x - 2} 68 L${x + 15} 42 L${x + 32} 68 Z`} fill={roof} />
          </g>
        ))}
        <path d="M84 92 L120 60 L156 92 Z" fill={roof} />
        {[96, 118, 140].map((x) => (
          <rect key={`window-${x}`} x={x} y="90" width="10" height="14" rx="5" fill="#d7defa" />
        ))}
        {[76, 176].map((x) => (
          <path key={`banner-${x}`} d={`M${x} 58 V94`} stroke={accent} strokeWidth="7" strokeLinecap="round" />
        ))}
      </>
    );
  }

  if (typeId === 'spanish-palace-suite') {
    return (
      <>
        {[38, 86, 134, 182].map((x) => (
          <path
            key={`arch-${x}`}
            d={`M${x} 124 V80 Q${x + 18} 50 ${x + 36} 80 V124`}
            fill="rgba(255,255,255,0.24)"
            stroke={trim}
            strokeWidth="7"
          />
        ))}
        <circle cx="120" cy="48" r="24" fill="rgba(255,240,212,0.82)" />
        <ellipse cx="120" cy="128" rx="52" ry="16" fill="rgba(28,154,183,0.18)" />
        <circle cx="120" cy="118" r="22" fill="rgba(28,154,183,0.28)" stroke={accent} strokeWidth="6" />
        <path d="M120 92 V122" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
        <path d="M100 124 H140" stroke="rgba(255,255,255,0.72)" strokeWidth="5" strokeLinecap="round" />
        {[48, 94, 146, 192].map((x) => (
          <rect key={`lamp-${x}`} x={x} y="38" width="10" height="18" rx="5" fill="#fff3bf" />
        ))}
      </>
    );
  }

  if (typeId === 'mesoamerican-pyramid-room') {
    return (
      <>
        <circle cx="188" cy="42" r="24" fill="rgba(255,223,107,0.72)" />
        <path d="M50 132 H190 L174 110 H66 Z" fill="#b88350" stroke={trim} strokeWidth="6" />
        <path d="M66 110 H174 L158 88 H82 Z" fill="#c99863" stroke={trim} strokeWidth="6" />
        <path d="M84 88 H156 L144 68 H96 Z" fill="#d8b27b" stroke={trim} strokeWidth="6" />
        <rect x="108" y="54" width="24" height="14" rx="4" fill={wall} stroke={trim} strokeWidth="5" />
        {[32, 206].map((x) => (
          <g key={`torch-${x}`}>
            <path d={`M${x} 84 V126`} stroke={trim} strokeWidth="8" strokeLinecap="round" />
            <path d={`M${x - 10} 84 Q${x} 64 ${x + 10} 84 Z`} fill={accent} />
          </g>
        ))}
      </>
    );
  }

  if (typeId === 'grecoroman-circus-hall') {
    return (
      <>
        {[30, 64, 98, 132, 166, 200].map((x) => (
          <rect key={`column-${x}`} x={x} y="68" width="10" height="52" rx="5" fill="#f6efe4" stroke={trim} strokeWidth="4" />
        ))}
        <path d="M18 124 Q120 50 222 124" fill="rgba(255,255,255,0.14)" stroke={roof} strokeWidth="8" />
        <ellipse cx="120" cy="128" rx="78" ry="22" fill="rgba(214,85,110,0.14)" stroke={accent} strokeWidth="5" />
        {[34, 62, 90, 118, 146, 174, 202].map((x, index) => (
          <path key={`garland-${x}`} d={`M${x} 60 L${x + 12} 76 L${x + 24} 60`} fill={index % 2 === 0 ? accent : roof} />
        ))}
      </>
    );
  }

  if (typeId === 'scandinavian-longhouse') {
    return (
      <>
        {[34, 74, 114, 154, 194].map((x) => (
          <path key={`rafter-${x}`} d={`M${x - 26} 54 L${x} 28 L${x + 26} 54`} stroke={roof} strokeWidth="12" strokeLinecap="round" fill="none" />
        ))}
        <rect x="36" y="86" width="168" height="34" rx="10" fill={wall} stroke={trim} strokeWidth="6" />
        {[56, 90, 124, 158, 192].map((x) => (
          <rect key={`beam-${x}`} x={x} y="86" width="6" height="34" rx="3" fill={trim} />
        ))}
        <circle cx="120" cy="122" r="18" fill="rgba(242,153,74,0.28)" />
        <circle cx="120" cy="122" r="10" fill={accent} opacity="0.72" />
      </>
    );
  }

  if (typeId === 'japanese-fortress') {
    return (
      <>
        <circle cx="190" cy="40" r="18" fill="rgba(255,255,255,0.82)" />
        <rect x="58" y="92" width="124" height="28" rx="8" fill={wall} stroke={trim} strokeWidth="6" />
        <path d="M48 94 L120 70 L192 94" fill={roof} />
        <rect x="76" y="72" width="88" height="18" rx="6" fill={wall} stroke={trim} strokeWidth="5" />
        <path d="M66 72 L120 54 L174 72" fill={roof} />
        {[86, 108, 130, 152].map((x) => (
          <path key={`shoji-${x}`} d={`M${x} 74 V120`} stroke={trim} strokeWidth="4" opacity="0.55" />
        ))}
        {[42, 66, 176, 198].map((x, index) => (
          <circle key={`blossom-${x}`} cx={x} cy={index % 2 === 0 ? 74 : 90} r="7" fill={index % 2 === 0 ? '#ffd3e1' : accent} opacity="0.86" />
        ))}
      </>
    );
  }

  if (typeId === 'babylonian-hanging-gardens') {
    return (
      <>
        {[34, 94, 154].map((x, index) => (
          <rect key={`terrace-${x}`} x={x} y={74 - index * 16} width="52" height="48" rx="10" fill={index === 1 ? '#c6a46e' : '#b88d58'} stroke={trim} strokeWidth="6" />
        ))}
        {[42, 76, 120, 160, 198].map((x) => (
          <path key={`vine-${x}`} d={`M${x} 44 C${x - 10} 72 ${x + 10} 100 ${x} 130`} stroke="#6ed39a" strokeWidth="8" strokeLinecap="round" fill="none" />
        ))}
        {[52, 112, 172].map((x) => (
          <path key={`arch-${x}`} d={`M${x} 124 V102 Q${x + 12} 90 ${x + 24} 102 V124`} fill="rgba(255,255,255,0.14)" stroke={trim} strokeWidth="5" />
        ))}
        {[70, 142, 202].map((x, index) => (
          <circle key={`flower-${x}`} cx={x} cy={index % 2 === 0 ? 72 : 88} r="8" fill={index % 2 === 0 ? '#ffd76b' : '#ff9ec0'} />
        ))}
      </>
    );
  }

  if (typeId === 'future-sky-dome') {
    return (
      <>
        <path d="M36 126 Q120 24 204 126" stroke={roof} strokeWidth="8" fill="none" />
        <path d="M36 126 H204" stroke={trim} strokeWidth="8" strokeLinecap="round" />
        {[48, 76, 104, 132, 160, 188].map((x) => (
          <path key={`rib-${x}`} d={`M${x} 126 V58`} stroke={trim} strokeWidth="4" opacity="0.42" />
        ))}
        {[40, 74, 108, 142, 176, 210].map((x, index) => (
          <circle key={`star-${x}`} cx={x} cy={index % 2 === 0 ? 44 : 30} r={index % 2 === 0 ? 4 : 3} fill="#f8fcff" />
        ))}
        <path d="M62 108 H178" stroke={accent} strokeWidth="8" strokeLinecap="round" opacity="0.64" />
        {[66, 96, 126, 164].map((x, index) => (
          <rect key={`console-${x}`} x={x} y={110 - (index % 2) * 14} width="18" height="16" rx="6" fill={index % 2 === 0 ? '#b2c7f1' : wall} stroke={trim} strokeWidth="4" />
        ))}
      </>
    );
  }

  return (
    <>
      <rect x="48" y="90" width="144" height="28" rx="10" fill={wall} stroke={trim} strokeWidth="6" />
      <path d="M42 90 L120 52 L198 90" fill={roof} />
    </>
  );
};

const WorldFeatureArt = ({ entry, opacity = 1, style = {}, glow = false }) => {
  const scene = getWorldScene(entry);

  return (
    <svg
      viewBox="0 0 240 150"
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        opacity,
        filter: glow ? 'drop-shadow(0 10px 22px rgba(15, 23, 42, 0.16))' : 'none',
        ...style,
      }}
    >
      {renderWorldFeatureArt(entry, scene.palette)}
    </svg>
  );
};

const WorldBoardAtmosphere = ({ entry }) => {
  const scene = getWorldScene(entry);
  const isFuture = getHouseArtTypeId(entry) === 'future-sky-dome';

  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: scene.boardBackground,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: scene.boardGlow,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '-2%',
          right: '-2%',
          top: '6%',
          height: '32%',
          opacity: isFuture ? 0.74 : 0.5,
        }}
      >
        <WorldFeatureArt entry={entry} opacity={0.72} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: '10%',
          right: '10%',
          top: '34%',
          height: 12,
          borderRadius: 999,
          background: isFuture
            ? 'linear-gradient(90deg, rgba(133,241,255,0.08), rgba(133,241,255,0.24), rgba(133,241,255,0.08))'
            : `linear-gradient(90deg, rgba(255,255,255,0.08), ${scene.palette.glowColor}, rgba(255,255,255,0.08))`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '4%',
          right: '4%',
          bottom: '12%',
          height: '24%',
          borderRadius: '48px 48px 24px 24px',
          background: isFuture
            ? 'linear-gradient(180deg, rgba(92,118,182,0.18), rgba(34,52,97,0.28))'
            : 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(103, 146, 95, 0.22))',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '8%',
          right: '8%',
          bottom: '8%',
          height: '16%',
          borderRadius: 999,
          border: isFuture
            ? '2px solid rgba(191, 225, 255, 0.28)'
            : `2px dashed ${scene.palette.trimColor}30`,
        }}
      />
    </>
  );
};

const PLANET_SLOT_ROWS = [
  { y: 22, xs: [31, 43, 57, 69], scale: 0.72 },
  { y: 38, xs: [20, 35, 50, 65, 80], scale: 0.84 },
  { y: 56, xs: [16, 30, 43, 57, 70, 84], scale: 0.96 },
  { y: 74, xs: [22, 37, 50, 63, 78], scale: 1.08 },
];

const getPlanetSlotLayouts = (tiles) => {
  let tileIndex = 0;

  return PLANET_SLOT_ROWS.flatMap((row, rowIndex) =>
    row.xs.map((x, columnIndex) => {
      const tile = tiles[tileIndex];
      tileIndex += 1;

      if (!tile) {
        return null;
      }

      return {
        tile,
        x,
        y: row.y,
        scale: row.scale,
        rowIndex,
        columnIndex,
      };
    })
  ).filter(Boolean);
};

const getHouseMarkerLabel = (house) => {
  const suffix = house?.name?.match(/(\d+)$/)?.[1];
  return suffix ? `${house.shortLabel} ${suffix}` : house?.shortLabel || '';
};

const PlanetTileButton = ({
  layout,
  house,
  selectedHouseType,
  onTilePress,
  timeMs,
}) => {
  const occupied = Boolean(house);
  const entry = occupied ? house : selectedHouseType;
  const scene = getWorldScene(entry);
  const motionPhase = layout.rowIndex * 0.72 + layout.columnIndex * 0.38;
  const markerWidth = Math.round((occupied ? 124 : 98) * layout.scale);
  const markerHeight = Math.round((occupied ? 134 : 102) * layout.scale);
  const houseSize = Math.round(86 * layout.scale);
  const plusSize = Math.round(36 * layout.scale);
  const padWidth = Math.round((occupied ? 104 : 84) * layout.scale);
  const padHeight = Math.round((occupied ? 36 : 30) * layout.scale);
  const glowSize = Math.round((occupied ? 136 : 98) * layout.scale);
  const padBorder = occupied
    ? `2px solid ${scene.palette.trimColor}44`
    : `2px dashed ${scene.palette.trimColor}44`;
  const markerBob = Math.sin(timeMs / 1400 + motionPhase) * (occupied ? 3.4 : 2.2);
  const houseBob = Math.sin(timeMs / 1180 + motionPhase * 1.3) * 2.4;
  const plusScale = 1 + Math.sin(timeMs / 1040 + motionPhase) * 0.06;
  const glowOpacity = occupied
    ? 0.74 + ((Math.sin(timeMs / 920 + motionPhase) + 1) / 2) * 0.2
    : 0.52 + ((Math.sin(timeMs / 760 + motionPhase) + 1) / 2) * 0.18;

  return (
    <button
      id={`builder-world-${layout.tile.id}`}
      type="button"
      onClick={() => onTilePress(layout.tile.id)}
      style={{
        position: 'absolute',
        left: `${layout.x}%`,
        top: `${layout.y}%`,
        transform: `translate(-50%, -100%) translateY(${markerBob}px)`,
        width: markerWidth,
        height: markerHeight,
        border: 0,
        padding: 0,
        background: 'transparent',
        cursor: 'pointer',
        zIndex: 20 + Math.round(layout.y),
      }}
      aria-label={
        occupied
          ? `Enter ${house.name}`
          : `Place house on tile ${layout.tile.x + 1}, ${layout.tile.y + 1}`
      }
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: Math.round(6 * layout.scale),
          transform: 'translateX(-50%)',
          width: glowSize,
          height: Math.round(28 * layout.scale),
          borderRadius: '50%',
          background: occupied ? house.palette.glowColor : 'rgba(255,255,255,0.22)',
          filter: 'blur(12px)',
          opacity: glowOpacity,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: Math.round(10 * layout.scale),
          transform: 'translateX(-50%)',
          width: padWidth,
          height: padHeight,
          borderRadius: '50%',
          border: padBorder,
          background: occupied
            ? `linear-gradient(180deg, rgba(255,255,255,0.94), ${scene.palette.glowColor} 66%, rgba(255,255,255,0.86) 100%)`
            : `linear-gradient(180deg, rgba(255,255,255,0.94), ${scene.plusBackground} 100%)`,
          boxShadow: occupied
            ? '0 12px 20px rgba(15, 23, 42, 0.14)'
            : '0 10px 18px rgba(15, 23, 42, 0.1)',
        }}
      />

      {occupied ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: Math.round(18 * layout.scale),
              transform: `translateX(-50%) translateY(${houseBob}px)`,
            }}
          >
            <HouseArt entry={house} size={houseSize} />
          </div>
          <div
            style={{
              position: 'absolute',
              top: Math.round(8 * layout.scale),
              right: Math.round(4 * layout.scale),
              padding: `${Math.max(4, Math.round(5 * layout.scale))}px ${Math.max(
                8,
                Math.round(9 * layout.scale)
              )}px`,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.9)',
              color: scene.titleColor,
              fontSize: Math.max(10, Math.round(11 * layout.scale)),
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: 0.6,
              boxShadow: '0 8px 18px rgba(15, 23, 42, 0.08)',
            }}
          >
            {getHouseMarkerLabel(house)}
          </div>
        </>
      ) : (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: Math.round(26 * layout.scale),
            transform: `translateX(-50%) scale(${plusScale})`,
            width: plusSize,
            height: plusSize,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            fontSize: Math.max(20, Math.round(24 * layout.scale)),
            fontWeight: 500,
            color: scene.titleColor,
            background: scene.plusBackground,
            boxShadow: '0 10px 18px rgba(15, 23, 42, 0.1)',
          }}
        >
          +
        </div>
      )}
    </button>
  );
};

const PLANET_STARS = [
  { left: '8%', top: '12%', size: 8, delayMs: 0 },
  { left: '18%', top: '24%', size: 6, delayMs: 1100 },
  { left: '30%', top: '10%', size: 10, delayMs: 400 },
  { left: '72%', top: '16%', size: 8, delayMs: 1800 },
  { left: '86%', top: '28%', size: 6, delayMs: 900 },
  { left: '14%', top: '74%', size: 7, delayMs: 1500 },
  { left: '78%', top: '78%', size: 9, delayMs: 200 },
];

const PLANET_SATELLITES = [
  { size: '96%', durationMs: 22000, delayMs: 0, angle: '14deg', icon: 'circle' },
  { size: '112%', durationMs: 30000, delayMs: -4000, angle: '144deg', icon: 'lantern' },
  { size: '126%', durationMs: 36000, delayMs: -10000, angle: '262deg', icon: 'gem' },
];

const ANIMATED_PLANET_CLOUDS = [
  { id: 'cloud-a', left: 18, top: 18, width: 70, height: 22, durationMs: 8000, delayMs: 0, driftX: 11 },
  { id: 'cloud-b', left: 50, top: 28, width: 88, height: 28, durationMs: 10000, delayMs: 800, driftX: 13 },
  { id: 'cloud-c', left: 80, top: 38, width: 106, height: 34, durationMs: 12000, delayMs: 1600, driftX: 15 },
];

const toAnimationPhase = (timeMs, durationMs, delayMs = 0) => {
  const cycle = durationMs || 1;
  const raw = ((timeMs + delayMs) % cycle) / cycle;
  return raw < 0 ? raw + 1 : raw;
};

const getPlanetFloatMotion = (timeMs) => {
  const phase = toAnimationPhase(timeMs, 10000);
  const arc = Math.sin(phase * Math.PI);

  return {
    planetOffsetY: Number((-10 * arc).toFixed(2)),
    planetTiltDeg: Number((Math.sin(phase * Math.PI * 2) * 1.5).toFixed(2)),
  };
};

const getPlanetStarMotion = (timeMs, delayMs = 0) => {
  const phase = toAnimationPhase(timeMs, 3800, delayMs);
  const sparkle = (Math.sin(phase * Math.PI * 2 - Math.PI / 2) + 1) / 2;

  return {
    opacity: Number((0.22 + sparkle * 0.68).toFixed(3)),
    scale: Number((0.85 + sparkle * 0.33).toFixed(3)),
  };
};

const getSatelliteBobOffset = (timeMs, index) => {
  const phase = toAnimationPhase(timeMs, (4 + index) * 1000);
  return Number((Math.sin(phase * Math.PI) * -6).toFixed(2));
};

const createInitialBuilderWorldRuntime = () => ({
  timeMs: 0,
});

const advanceBuilderWorldRuntime = (runtime, ms) => ({
  ...runtime,
  timeMs: runtime.timeMs + ms,
});

const buildBuilderWorldSnapshot = (runtime) => ({
  timeMs: Math.round(runtime.timeMs),
  ...getPlanetFloatMotion(runtime.timeMs),
  ringPhase: Number(toAnimationPhase(runtime.timeMs, 30000).toFixed(3)),
  reverseRingPhase: Number(toAnimationPhase(runtime.timeMs, 44000).toFixed(3)),
  stars: PLANET_STARS.map((star, index) => ({
    id: `star-${index}`,
    ...getPlanetStarMotion(runtime.timeMs, star.delayMs),
  })),
  satellites: PLANET_SATELLITES.map((satellite, index) => {
    return {
      id: `satellite-${index}`,
      orbitPhase: Number(
        toAnimationPhase(runtime.timeMs, satellite.durationMs, satellite.delayMs).toFixed(3)
      ),
      bobPhase: Number(toAnimationPhase(runtime.timeMs, (4 + index) * 1000).toFixed(3)),
      bobOffsetY: getSatelliteBobOffset(runtime.timeMs, index),
      angle: satellite.angle,
      size: satellite.size,
      icon: satellite.icon,
    };
  }),
  clouds: ANIMATED_PLANET_CLOUDS.map((cloud) => {
    const phase = toAnimationPhase(runtime.timeMs, cloud.durationMs, cloud.delayMs);
    const driftX = Number((-10 + Math.sin(phase * Math.PI) * cloud.driftX).toFixed(2));

    return {
      id: cloud.id,
      x: Number((cloud.left + driftX / 16).toFixed(2)),
      y: cloud.top,
      opacity: Number((0.12 + Math.sin(phase * Math.PI) * 0.06).toFixed(3)),
    };
  }),
});

const BuilderWorld = ({
  builderState,
  houseTypes,
  selectedHouseTypeId,
  onSelectHouseType,
  onTilePress,
  onEnterHouse,
  onBack,
}) => {
  const selectedHouseType =
    houseTypes.find((houseType) => houseType.id === selectedHouseTypeId) || houseTypes[0];
  const selectedScene = getWorldScene(selectedHouseType);
  const planetSlots = getPlanetSlotLayouts(builderState.tiles);
  const worldRuntimeRef = useRef(createInitialBuilderWorldRuntime());
  const [worldRuntime, setWorldRuntime] = useState(() => createInitialBuilderWorldRuntime());
  const worldRuntimeSnapshot = buildBuilderWorldSnapshot(worldRuntime);

  useEffect(() => {
    worldRuntimeRef.current = worldRuntime;
  }, [worldRuntime]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const snapshot = buildBuilderWorldSnapshot(worldRuntimeRef.current);
    window.__builderWorldRuntime = snapshot;

    return () => {
      if (window.__builderWorldRuntime === snapshot) {
        window.__builderWorldRuntime = undefined;
      }
    };
  }, [worldRuntimeSnapshot]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const advanceRuntime = (ms = 1000 / 60) => {
      setWorldRuntime((current) => {
        const next = advanceBuilderWorldRuntime(current, ms);
        worldRuntimeRef.current = next;
        return next;
      });
    };

    window.__advanceBuilderWorld = advanceRuntime;

    return () => {
      if (window.__advanceBuilderWorld === advanceRuntime) {
        window.__advanceBuilderWorld = undefined;
      }
    };
  }, []);

  useEffect(() => {
    let animationFrameId = null;
    let lastTimestamp = null;

    const tick = (timestamp) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }

      const deltaMs = Math.min(34, timestamp - lastTimestamp);
      lastTimestamp = timestamp;

      setWorldRuntime((current) => {
        const next = advanceBuilderWorldRuntime(current, deltaMs);
        worldRuntimeRef.current = next;
        return next;
      });

      animationFrameId = window.requestAnimationFrame(tick);
    };

    animationFrameId = window.requestAnimationFrame(tick);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div
      style={{
        ...panelStyle,
        width: 'min(1400px, calc(100vw - 24px))',
        maxHeight: 'calc(100dvh - 32px)',
        overflowY: 'auto',
        padding: '24px',
        color: '#17345c',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.5fr) minmax(300px, 0.66fr)',
          gap: 22,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 1.4,
              textTransform: 'uppercase',
              opacity: 0.72,
              marginBottom: 8,
            }}
          >
            P2 Builder World
          </div>
          <h2
            style={{
              fontSize: 'clamp(30px, 4vw, 48px)',
              lineHeight: 1.04,
              margin: '0 0 12px',
              whiteSpace: 'pre-line',
            }}
          >
            {'Circle a tiny world\nplant a dream house\nstep through its door'}
          </h2>
          <p
            style={{
              whiteSpace: 'pre-line',
              fontSize: 17,
              lineHeight: 1.42,
              maxWidth: 640,
              margin: '0 0 18px',
            }}
          >
            {`Tap any glowing garden patch\na ${selectedHouseType.name.toLowerCase()} lands there\ntap its door to enter`}
          </p>

          <div
            style={{
              position: 'relative',
              padding: 18,
              borderRadius: 34,
              overflow: 'hidden',
              minHeight: 'clamp(560px, 74vw, 860px)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.74), 0 22px 44px rgba(15, 23, 42, 0.12)',
            }}
          >
            <WorldBoardAtmosphere entry={selectedHouseType} />
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                minHeight: 'clamp(520px, 70vw, 820px)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 18,
                  top: 18,
                  zIndex: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  maxWidth: 420,
                  padding: '12px 14px',
                  borderRadius: 24,
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,255,255,0.42))',
                  boxShadow: '0 18px 30px rgba(15, 23, 42, 0.1)',
                }}
              >
                <HouseArt entry={selectedHouseType} size={68} showBadge={false} />
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: 1.1,
                      textTransform: 'uppercase',
                      color: selectedScene.subtitleColor,
                      marginBottom: 6,
                    }}
                  >
                    Selected Destination
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      lineHeight: 1.05,
                      fontWeight: 800,
                      color: selectedScene.titleColor,
                      marginBottom: 4,
                    }}
                  >
                    {selectedHouseType.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      lineHeight: 1.3,
                      color: selectedScene.subtitleColor,
                    }}
                  >
                    {selectedHouseType.roomTheme?.name || 'Dream room'}
                    {'  '}
                    {'|'}
                    {'  '}
                    {selectedHouseType.roomTheme?.tagline || 'storybook destination'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  position: 'absolute',
                  right: 18,
                  top: 18,
                  zIndex: 3,
                  padding: '12px 14px',
                  borderRadius: 22,
                  maxWidth: 260,
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))',
                  boxShadow: '0 16px 28px rgba(15, 23, 42, 0.08)',
                  color: selectedScene.subtitleColor,
                  fontSize: 13,
                  lineHeight: 1.32,
                  whiteSpace: 'pre-line',
                }}
              >
                {'A little prince planet.\nGlowing pads mean place.\nA tiny house means enter.'}
              </div>

              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '52%',
                  transform: `translate(-50%, calc(-50% + ${worldRuntimeSnapshot.planetOffsetY}px)) rotate(${worldRuntimeSnapshot.planetTiltDeg}deg)`,
                  width: 'min(100%, 880px)',
                  aspectRatio: '1 / 1',
                }}
              >
                {PLANET_STARS.map((star, index) => (
                  <div
                    key={`planet-star-${index}`}
                    style={{
                      position: 'absolute',
                      left: star.left,
                      top: star.top,
                      width: star.size,
                      height: star.size,
                      borderRadius: '50%',
                      background: index % 2 === 0 ? 'rgba(255,255,255,0.92)' : selectedScene.palette.accentColor,
                      boxShadow: `0 0 12px ${selectedScene.palette.accentColor}`,
                      opacity: worldRuntimeSnapshot.stars[index]?.opacity ?? 0.4,
                      transform: `scale(${worldRuntimeSnapshot.stars[index]?.scale ?? 1})`,
                    }}
                  />
                ))}

                {PLANET_SATELLITES.map((satellite, index) => (
                  <div
                    key={`planet-satellite-orbit-${index}`}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: satellite.size,
                      height: satellite.size,
                      transform: `translate(-50%, -50%) rotate(${(worldRuntimeSnapshot.satellites[index]?.orbitPhase ?? 0) * 360}deg)`,
                      pointerEvents: 'none',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        border: index === 1
                          ? `1px dashed ${selectedScene.tileBorder}`
                          : `1px solid ${selectedScene.tileBorder}`,
                        opacity: index === 0 ? 0.26 : 0.18,
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: `rotate(${satellite.angle}) translateX(calc(${satellite.size} / 2.08))`,
                        transformOrigin: '0 0',
                      }}
                    >
                      <div
                        style={{
                          width: 24 - index * 3,
                          height: 24 - index * 3,
                          transform: `translateY(${worldRuntimeSnapshot.satellites[index]?.bobOffsetY ?? 0}px)`,
                          borderRadius: satellite.icon === 'gem' ? 8 : '50%',
                          background:
                            satellite.icon === 'circle'
                              ? 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.42))'
                              : satellite.icon === 'lantern'
                                ? `linear-gradient(180deg, #fff7cc, ${selectedScene.palette.accentColor})`
                                : `linear-gradient(180deg, rgba(255,255,255,0.92), ${selectedScene.palette.accentColor})`,
                          border: `2px solid ${selectedScene.palette.trimColor}`,
                          boxShadow: `0 0 18px ${selectedScene.palette.glowColor}`,
                        }}
                      />
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    position: 'absolute',
                    inset: '2%',
                    borderRadius: '50%',
                    border: `2px dashed ${selectedScene.tileBorder}`,
                    transform: `rotate(${worldRuntimeSnapshot.ringPhase * 360 - 8}deg)`,
                    opacity: 0.64,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: '8% 3%',
                    borderRadius: '50%',
                    border: `1px solid ${selectedScene.tileBorder}`,
                    transform: `rotate(${11 - worldRuntimeSnapshot.reverseRingPhase * 360}deg)`,
                    opacity: 0.4,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: '16%',
                    right: '16%',
                    bottom: '6%',
                    height: '10%',
                    borderRadius: '50%',
                    background: 'rgba(15, 23, 42, 0.18)',
                    filter: 'blur(22px)',
                    opacity: 0.52,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: '10%',
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 34% 24%, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.16) 19%, rgba(255,255,255,0) 34%), radial-gradient(circle at 62% 78%, rgba(15,23,42,0.18) 0%, rgba(15,23,42,0) 34%), ${selectedScene.boardBackground}`,
                    boxShadow: `inset 0 -34px 48px rgba(15, 23, 42, 0.18), inset 0 18px 32px rgba(255,255,255,0.22), 0 28px 48px rgba(15, 23, 42, 0.14)`,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: '10% 12% 24%',
                      opacity: 0.46,
                    }}
                  >
                    <WorldFeatureArt entry={selectedHouseType} opacity={0.9} />
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      left: '10%',
                      right: '10%',
                      top: '34%',
                      height: '6%',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.14)',
                      filter: 'blur(10px)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: '12%',
                      right: '12%',
                      bottom: '18%',
                      height: '22%',
                      borderRadius: '50%',
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(15, 23, 42, 0.08))',
                    }}
                  />
                  {ANIMATED_PLANET_CLOUDS.map((cloud, index) => (
                    <div
                      key={cloud.id}
                      style={{
                        position: 'absolute',
                        left: `${worldRuntimeSnapshot.clouds[index]?.x ?? cloud.left}%`,
                        top: `${worldRuntimeSnapshot.clouds[index]?.y ?? cloud.top}%`,
                        width: cloud.width,
                        height: cloud.height,
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.16)',
                        filter: 'blur(8px)',
                        transform: 'translateX(-50%)',
                        opacity: worldRuntimeSnapshot.clouds[index]?.opacity ?? 0.16,
                      }}
                    />
                  ))}
                </div>

                <div
                  style={{
                    position: 'absolute',
                    inset: '10%',
                  }}
                >
                  {planetSlots.map((layout) => {
                    const house = layout.tile.houseId
                      ? getHouseById(builderState, layout.tile.houseId)
                      : null;

                    return (
                      <PlanetTileButton
                        key={layout.tile.id}
                        layout={layout}
                        house={house}
                        selectedHouseType={selectedHouseType}
                        onTilePress={onTilePress}
                        timeMs={worldRuntime.timeMs}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            alignContent: 'start',
            gap: 14,
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.66)',
              borderRadius: 24,
              padding: '18px 18px',
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
                opacity: 0.72,
                marginBottom: 8,
              }}
            >
              Quick Rules
            </div>
            <div style={{ whiteSpace: 'pre-line', lineHeight: 1.34, fontSize: 15 }}>
              {'Pick a world style.\nGlow patch means place.\nTiny house means enter.'}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.66)',
              borderRadius: 24,
              padding: '18px 18px',
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
                opacity: 0.72,
                marginBottom: 8,
              }}
            >
              Built Tonight
            </div>
            <div style={{ fontSize: 34, fontWeight: 800 }}>{builderState.houses.length}</div>
            <div style={{ marginTop: 4, fontSize: 15 }}>
              {builderState.houses.length === 1 ? 'little world' : 'little worlds'}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.66)',
              borderRadius: 24,
              padding: '18px 18px',
              display: 'grid',
              gap: 10,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  opacity: 0.72,
                }}
              >
                House Styles
              </div>
              {houseTypes.map((houseType) => {
                const selected = houseType.id === selectedHouseTypeId;

                return (
                  <button
                    key={houseType.id}
                    type="button"
                    onClick={() => onSelectHouseType(houseType.id)}
                    style={{
                      border: selected ? `2px solid ${houseType.roofColor}` : '1px solid rgba(23, 52, 92, 0.1)',
                      borderRadius: 18,
                      background: selected
                        ? getWorldScene(houseType).tileBackground
                        : '#ffffff',
                      padding: '12px 14px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      boxShadow: selected
                        ? `0 12px 20px ${houseType.glowColor}`
                        : '0 10px 18px rgba(15, 23, 42, 0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <HouseArt entry={houseType} size={52} showBadge={false} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800 }}>{houseType.name}</div>
                        <div style={{ fontSize: 12, opacity: 0.72 }}>
                          {houseType.roomTheme.name}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.66)',
                borderRadius: 24,
                padding: '18px 18px',
                display: 'grid',
                gap: 10,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                fontWeight: 800,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
                opacity: 0.72,
              }}
            >
                Houses
              </div>
            {builderState.houses.length === 0 ? (
              <div style={{ fontSize: 15, lineHeight: 1.34 }}>
                {'The first world room starts\nwith one tap on the map.'}
              </div>
            ) : (
              builderState.houses.map((house) => (
                <button
                  key={house.id}
                  type="button"
                  onClick={() => onEnterHouse(house.id)}
                  style={{
                    border: 0,
                    borderRadius: 18,
                    background: '#ffffff',
                    padding: '12px 14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    boxShadow: '0 10px 18px rgba(15, 23, 42, 0.08)',
                  }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <HouseArt entry={house} size={46} showBadge={false} />
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800 }}>{house.name}</div>
                      <div style={{ fontSize: 12, opacity: 0.72 }}>
                        {house.roomTheme?.name || 'tap to enter room'}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          <button id="builder-home-btn" type="button" onClick={onBack} style={buttonStyle('#ffffff')}>
            Back To Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuilderWorld;
