import React, { useEffect, useRef, useState } from 'react';
import {
  BUILDER_ROOM_GRID_SIZE,
  getFurnitureCatalogForTheme,
  snapRoomPosition,
} from './builderState';

const panelStyle = {
  background: 'rgba(255, 249, 240, 0.82)',
  border: '1px solid rgba(255, 255, 255, 0.7)',
  borderRadius: 30,
  boxShadow: '0 24px 65px rgba(15, 23, 42, 0.22)',
  backdropFilter: 'blur(12px)',
};

const actionButtonStyle = {
  border: 0,
  borderRadius: 999,
  padding: '12px 18px',
  minHeight: 54,
  fontSize: 15,
  fontWeight: 700,
  background: '#ffffff',
  color: '#17345c',
  cursor: 'pointer',
};

const dragCardStyle = {
  borderRadius: 18,
  padding: '14px 14px',
  background: '#ffffff',
  boxShadow: '0 10px 18px rgba(15, 23, 42, 0.08)',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  cursor: 'grab',
  touchAction: 'none',
  userSelect: 'none',
};

const getRoomLayoutMode = () => {
  if (typeof window === 'undefined') {
    return {
      compact: false,
      stacked: false,
    };
  }

  const width = Math.round(window.visualViewport?.width ?? window.innerWidth);
  return {
    compact: width <= 980,
    stacked: width <= 1180,
  };
};

const getRoomDropState = (roomElement, furniture, pointerOffset, clientX, clientY) => {
  const bounds = roomElement.getBoundingClientRect();
  const rawX = clientX - bounds.left - pointerOffset.x;
  const rawY = clientY - bounds.top - pointerOffset.y;

  return {
    insideRoom:
      clientX >= bounds.left &&
      clientX <= bounds.right &&
      clientY >= bounds.top &&
      clientY <= bounds.bottom,
    snapped: snapRoomPosition(
      {
        width: roomElement.clientWidth,
        height: roomElement.clientHeight,
      },
      furniture,
      {
        x: rawX,
        y: rawY,
      }
    ),
  };
};

const FurnitureArt = ({ item, ghost = false }) => {
  const sharedStyle = {
    position: 'absolute',
    inset: 0,
    opacity: ghost ? 0.82 : 1,
  };

  if (item.type === 'lantern' || item.type === 'lamp') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '20%',
            right: '20%',
            top: '12%',
            height: '34%',
            borderRadius: '22px 22px 14px 14px',
            background: `linear-gradient(180deg, ${item.color}, #ffffff)`,
            border: `3px solid ${item.accent}`,
            boxShadow: ghost ? '0 0 24px rgba(96, 165, 250, 0.24)' : '0 10px 18px rgba(96, 165, 250, 0.16)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '46%',
            top: '43%',
            width: '8%',
            height: '33%',
            borderRadius: 999,
            background: item.accent,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '28%',
            right: '28%',
            bottom: '12%',
            height: '12%',
            borderRadius: 999,
            background: '#e2e8f0',
          }}
        />
      </div>
    );
  }

  if (item.type === 'torch') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '46%',
            top: '20%',
            width: '8%',
            height: '58%',
            borderRadius: 999,
            background: item.accent,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '28%',
            top: '6%',
            width: '44%',
            height: '26%',
            borderRadius: '50% 50% 45% 45%',
            background: `radial-gradient(circle at 50% 30%, #fff7cc 0%, ${item.color} 50%, ${item.accent} 100%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '28%',
            bottom: '10%',
            width: '44%',
            height: '10%',
            borderRadius: 999,
            background: '#8b5e3c',
          }}
        />
      </div>
    );
  }

  if (item.type === 'plate') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '12%',
            right: '12%',
            bottom: '18%',
            height: '18%',
            borderRadius: 999,
            background: '#8b5e3c',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '14%',
            right: '14%',
            top: '24%',
            height: '34%',
            borderRadius: 999,
            background: '#fff8e8',
            border: `3px solid ${item.accent}`,
          }}
        />
        {['18%', '40%', '62%'].map((left, index) => (
          <div
            key={`${item.id}-fruit-${left}`}
            style={{
              position: 'absolute',
              left,
              top: index === 1 ? '26%' : '30%',
              width: '20%',
              height: '22%',
              borderRadius: '50%',
              background: index === 1 ? item.accent : item.color,
            }}
          />
        ))}
      </div>
    );
  }

  if (item.type === 'recliner') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '10%',
            bottom: '16%',
            width: '70%',
            height: '30%',
            borderRadius: 20,
            background: `linear-gradient(180deg, ${item.color}, ${item.accent})`,
            border: `3px solid ${item.accent}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '8%',
            top: '20%',
            width: '34%',
            height: '46%',
            borderRadius: 18,
            background: `linear-gradient(180deg, ${item.color}, ${item.accent})`,
            border: `3px solid ${item.accent}`,
          }}
        />
        {['16%', '64%'].map((left) => (
          <div
            key={`${item.id}-leg-${left}`}
            style={{
              position: 'absolute',
              left,
              bottom: '8%',
              width: '8%',
              height: '16%',
              borderRadius: 999,
              background: '#8b5e3c',
            }}
          />
        ))}
      </div>
    );
  }

  if (item.type === 'stool') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '14%',
            right: '14%',
            top: '18%',
            height: '24%',
            borderRadius: 14,
            background: item.color,
            border: `3px solid ${item.accent}`,
          }}
        />
        {['22%', '66%'].map((left) => (
          <div
            key={`${item.id}-stool-leg-${left}`}
            style={{
              position: 'absolute',
              left,
              top: '38%',
              width: '10%',
              height: '42%',
              borderRadius: 999,
              background: item.accent,
            }}
          />
        ))}
      </div>
    );
  }

  if (item.type === 'gem') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '24%',
            right: '24%',
            top: '6%',
            height: '42%',
            clipPath: 'polygon(50% 0%, 90% 24%, 76% 100%, 24% 100%, 10% 24%)',
            background: `linear-gradient(180deg, #ffffff, ${item.color} 45%, ${item.accent} 100%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '34%',
            right: '34%',
            bottom: '12%',
            height: '28%',
            borderRadius: 10,
            background: '#b58a61',
            border: `3px solid ${item.accent}`,
          }}
        />
      </div>
    );
  }

  if (item.type === 'screen') {
    return (
      <div style={sharedStyle}>
        {[6, 36, 66].map((left) => (
          <div
            key={`${item.id}-panel-${left}`}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: '10%',
              width: '24%',
              height: '72%',
              borderRadius: 12,
              background: item.color,
              border: `3px solid ${item.accent}`,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            left: '18%',
            top: '28%',
            width: '14%',
            height: '14%',
            borderRadius: '50%',
            background: '#ffd6ea',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '54%',
            top: '22%',
            width: '16%',
            height: '16%',
            borderRadius: '50%',
            background: '#ffd6ea',
          }}
        />
      </div>
    );
  }

  if (item.type === 'planter') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '18%',
            right: '18%',
            bottom: '16%',
            height: '24%',
            borderRadius: '10px 10px 18px 18px',
            background: '#c78d5d',
            border: `3px solid ${item.accent}`,
          }}
        />
        {['26%', '48%', '70%'].map((left, index) => (
          <div
            key={`${item.id}-vine-${left}`}
            style={{
              position: 'absolute',
              left,
              top: index === 1 ? '4%' : '10%',
              width: '10%',
              height: '58%',
              borderRadius: 999,
              background: index === 1 ? item.accent : item.color,
            }}
          />
        ))}
      </div>
    );
  }

  if (item.type === 'table') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '8%',
            right: '8%',
            top: '24%',
            height: '22%',
            borderRadius: 14,
            background: item.color,
            border: `3px solid ${item.accent}`,
          }}
        />
        {['18%', '72%'].map((left) => (
          <div
            key={`${item.id}-table-leg-${left}`}
            style={{
              position: 'absolute',
              left,
              top: '42%',
              width: '8%',
              height: '34%',
              borderRadius: 999,
              background: item.accent,
            }}
          />
        ))}
      </div>
    );
  }

  if (item.type === 'bench') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '8%',
            right: '8%',
            top: '24%',
            height: '18%',
            borderRadius: 12,
            background: item.color,
            border: `3px solid ${item.accent}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '10%',
            right: '10%',
            bottom: '18%',
            height: '14%',
            borderRadius: 12,
            background: item.accent,
          }}
        />
        {['16%', '72%'].map((left) => (
          <div
            key={`${item.id}-bench-leg-${left}`}
            style={{
              position: 'absolute',
              left,
              top: '40%',
              width: '8%',
              height: '28%',
              borderRadius: 999,
              background: item.accent,
            }}
          />
        ))}
      </div>
    );
  }

  if (item.type === 'chest') {
    return (
      <div style={sharedStyle}>
        <div
          style={{
            position: 'absolute',
            left: '12%',
            right: '12%',
            top: '18%',
            height: '28%',
            borderRadius: '16px 16px 8px 8px',
            background: item.color,
            border: `3px solid ${item.accent}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '12%',
            right: '12%',
            bottom: '16%',
            height: '30%',
            borderRadius: '8px 8px 16px 16px',
            background: '#bb8b61',
            border: `3px solid ${item.accent}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '46%',
            top: '42%',
            width: '8%',
            height: '12%',
            borderRadius: 999,
            background: '#f7d67a',
          }}
        />
      </div>
    );
  }

  return (
    <div style={sharedStyle}>
      <div
        style={{
          position: 'absolute',
          left: '6%',
          right: '6%',
          bottom: '14%',
          height: '42%',
          borderRadius: 22,
          background: `linear-gradient(180deg, ${item.color}, ${item.accent})`,
          border: `3px solid ${item.accent}`,
          boxShadow: ghost ? '0 0 24px rgba(251, 146, 60, 0.24)' : '0 10px 18px rgba(251, 146, 60, 0.14)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '12%',
          top: '16%',
          width: '22%',
          height: '24%',
          borderRadius: 14,
          background: '#fffdf7',
          border: '2px solid rgba(255,255,255,0.9)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '36%',
          top: '16%',
          width: '22%',
          height: '24%',
          borderRadius: 14,
          background: '#fff7ed',
          border: '2px solid rgba(255,255,255,0.9)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '8%',
          top: '22%',
          width: '20%',
          height: '14%',
          borderRadius: 999,
          background: '#fde68a',
          opacity: 0.9,
        }}
      />
    </div>
  );
};

const RoomThemeScene = ({ theme }) => {
  if (!theme) {
    return null;
  }

  const shape = (style) => ({
    position: 'absolute',
    pointerEvents: 'none',
    ...style,
  });

  if (theme.id === 'korean-garden') {
    return (
      <>
        <div style={shape({ right: '12%', top: '12%', width: 104, height: 104, borderRadius: '50%', border: `8px solid ${theme.frame}`, background: 'rgba(255,255,255,0.25)' })} />
        <div style={shape({ left: '8%', top: '16%', width: 126, height: 64, background: theme.wallTop, border: `4px solid ${theme.frame}`, borderRadius: '18px 18px 10px 10px' })} />
        <div style={shape({ left: '6%', top: '10%', width: 138, height: 34, clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)', background: theme.frame })} />
        {[14, 20, 26].map((offset, index) => (
          <div
            key={`bamboo-${offset}`}
            style={shape({
              left: `${offset}%`,
              top: `${22 + index * 3}%`,
              width: 14,
              height: 116,
              borderRadius: 999,
              background: index === 1 ? '#75b78c' : '#5f9a79',
            })}
          />
        ))}
        <div style={shape({ right: '10%', bottom: '12%', width: 146, height: 64, borderRadius: '50%', background: 'rgba(106, 175, 196, 0.34)' })} />
        {[0, 1, 2].map((index) => (
          <div
            key={`stone-${index}`}
            style={shape({
              left: `${40 + index * 7}%`,
              bottom: `${10 + (index % 2) * 4}%`,
              width: 42,
              height: 20,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.58)',
            })}
          />
        ))}
      </>
    );
  }

  if (theme.id === 'bavarian-castle') {
    return (
      <>
        {[14, 74].map((left) => (
          <div key={`tower-${left}`} style={shape({ left: `${left}%`, top: '12%', width: 62, height: 148, borderRadius: 16, background: '#f7efe6', border: `4px solid ${theme.frame}` })}>
            <div style={shape({ left: -4, top: -28, width: 70, height: 34, clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)', background: theme.frame })} />
          </div>
        ))}
        {[24, 44, 64].map((left) => (
          <div key={`window-${left}`} style={shape({ left: `${left}%`, top: '26%', width: 42, height: 78, borderRadius: '20px 20px 12px 12px', background: 'rgba(219, 234, 254, 0.8)', border: `4px solid ${theme.trim || theme.frame}` })} />
        ))}
        {[28, 60].map((left) => (
          <div key={`banner-${left}`} style={shape({ left: `${left}%`, top: '18%', width: 26, height: 82, borderRadius: 16, background: theme.accent, clipPath: 'polygon(0 0, 100% 0, 100% 82%, 50% 100%, 0 82%)' })} />
        ))}
      </>
    );
  }

  if (theme.id === 'spanish-palace') {
    return (
      <>
        {[10, 38, 66].map((left) => (
          <div key={`arch-${left}`} style={shape({ left: `${left}%`, top: '16%', width: 82, height: 128, borderRadius: '44px 44px 18px 18px', border: `5px solid ${theme.frame}`, background: 'rgba(255,255,255,0.3)' })} />
        ))}
        <div style={shape({ left: '50%', bottom: '18%', transform: 'translateX(-50%)', width: 86, height: 86, borderRadius: '50%', background: 'rgba(28, 154, 183, 0.2)', border: `6px solid ${theme.accent}` })} />
        <div style={shape({ left: '50%', bottom: '38%', transform: 'translateX(-50%)', width: 18, height: 42, borderRadius: 999, background: '#ffffff' })} />
        <div style={shape({ left: 0, right: 0, bottom: '9%', height: 22, background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.25) 0 18px, rgba(28, 154, 183, 0.34) 18px 36px, rgba(194,104,69,0.22) 36px 54px)' })} />
      </>
    );
  }

  if (theme.id === 'mesoamerican-pyramid') {
    return (
      <>
        <div style={shape({ left: '50%', top: '18%', transform: 'translateX(-50%)', width: 180, height: 150, clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)', background: 'rgba(124, 83, 46, 0.22)' })} />
        {[0, 1, 2, 3].map((step) => (
          <div
            key={`step-${step}`}
            style={shape({
              left: `${26 + step * 4}%`,
              top: `${46 + step * 6}%`,
              width: `${48 - step * 8}%`,
              height: 18,
              background: step % 2 === 0 ? '#cf9b63' : '#b88350',
              border: `2px solid ${theme.frame}`,
            })}
          />
        ))}
        <div style={shape({ left: '50%', top: '8%', transform: 'translateX(-50%)', width: 74, height: 74, borderRadius: '50%', background: 'rgba(255, 223, 107, 0.55)' })} />
        {[18, 76].map((left) => (
          <div key={`torch-${left}`} style={shape({ left: `${left}%`, bottom: '18%', width: 18, height: 70, borderRadius: 999, background: theme.frame })}>
            <div style={shape({ left: -8, top: -16, width: 34, height: 26, borderRadius: '50% 50% 45% 45%', background: theme.accent })} />
          </div>
        ))}
      </>
    );
  }

  if (theme.id === 'grecoroman-circus') {
    return (
      <>
        {[12, 30, 48, 66, 84].map((left) => (
          <div key={`column-${left}`} style={shape({ left: `${left}%`, top: '20%', width: 22, height: 134, borderRadius: 999, background: '#f6efe4', border: `3px solid ${theme.frame}` })} />
        ))}
        <div style={shape({ left: '50%', bottom: '16%', transform: 'translateX(-50%)', width: '78%', height: 88, borderRadius: '50%', background: 'rgba(214, 85, 110, 0.14)', border: `4px solid ${theme.accent}` })} />
        {[16, 28, 40, 52, 64, 76].map((left) => (
          <div key={`garland-${left}`} style={shape({ left: `${left}%`, top: '11%', width: 24, height: 34, background: left % 24 === 16 ? theme.accent : theme.frame, clipPath: 'polygon(0 0, 100% 0, 50% 100%)' })} />
        ))}
      </>
    );
  }

  if (theme.id === 'scandinavian-longhouse') {
    return (
      <>
        {[18, 36, 54, 72].map((left) => (
          <div key={`beam-${left}`} style={shape({ left: `${left}%`, top: '10%', width: 18, height: '72%', borderRadius: 999, background: theme.frame, opacity: 0.9 })} />
        ))}
        {[14, 34, 54, 74].map((left) => (
          <div key={`rafter-${left}`} style={shape({ left: `${left}%`, top: '6%', width: 86, height: 14, transform: 'rotate(32deg)', transformOrigin: 'left center', background: theme.frame, borderRadius: 999 })} />
        ))}
        <div style={shape({ left: '50%', bottom: '16%', transform: 'translateX(-50%)', width: 112, height: 112, borderRadius: '50%', background: 'rgba(242, 153, 74, 0.18)' })} />
        <div style={shape({ left: '50%', bottom: '24%', transform: 'translateX(-50%)', width: 64, height: 64, borderRadius: '50%', background: theme.accent, opacity: 0.55 })} />
        {[24, 68].map((left) => (
          <div key={`shield-${left}`} style={shape({ left: `${left}%`, top: '24%', width: 52, height: 52, borderRadius: '50%', background: '#d7c0a3', border: `4px solid ${theme.frame}` })} />
        ))}
      </>
    );
  }

  if (theme.id === 'japanese-fortress') {
    return (
      <>
        <div style={shape({ left: 0, right: 0, top: '10%', height: 26, background: theme.frame })} />
        <div style={shape({ left: '8%', right: '8%', top: '18%', height: 124, borderRadius: 16, background: 'rgba(255,255,255,0.22)', border: `4px solid ${theme.frame}` })} />
        {[18, 38, 58, 78].map((left) => (
          <div key={`shoji-${left}`} style={shape({ left: `${left}%`, top: '21%', width: 2, height: 112, background: theme.frame, opacity: 0.55 })} />
        ))}
        {[30, 50, 70].map((top) => (
          <div key={`shoji-row-${top}`} style={shape({ left: '10%', right: '10%', top: `${top}%`, height: 2, background: theme.frame, opacity: 0.42 })} />
        ))}
        <div style={shape({ left: '18%', bottom: '16%', width: 112, height: 12, borderRadius: 999, background: '#8f7357' })} />
        <div style={shape({ left: '18%', bottom: '18%', width: 12, height: 52, borderRadius: 999, background: '#8f7357' })} />
        <div style={shape({ left: '46%', bottom: '12%', width: 124, height: 44, borderRadius: '50%', background: 'rgba(245, 138, 172, 0.14)' })} />
      </>
    );
  }

  if (theme.id === 'babylonian-hanging-gardens') {
    return (
      <>
        {[8, 34, 60].map((left, index) => (
          <div key={`terrace-${left}`} style={shape({ left: `${left}%`, top: `${14 + index * 7}%`, width: 94, height: 108, borderRadius: '18px 18px 12px 12px', background: index === 1 ? '#c6a46e' : '#b88d58', border: `4px solid ${theme.frame}` })} />
        ))}
        {[14, 40, 66].map((left) => (
          <div key={`vine-${left}`} style={shape({ left: `${left}%`, top: '16%', width: 18, height: 152, borderRadius: 999, background: 'linear-gradient(180deg, #6ed39a, #467d6d)' })} />
        ))}
        {[20, 46, 72].map((left) => (
          <div key={`water-${left}`} style={shape({ left: `${left}%`, top: '46%', width: 46, height: 12, borderRadius: 999, background: 'rgba(132, 218, 255, 0.6)' })} />
        ))}
        {[22, 28, 48, 54, 74, 80].map((left, index) => (
          <div key={`flower-${left}`} style={shape({ left: `${left}%`, top: `${26 + (index % 2) * 18}%`, width: 20, height: 20, borderRadius: '50%', background: index % 2 === 0 ? '#ffd76b' : '#ff9ec0' })} />
        ))}
      </>
    );
  }

  if (theme.id === 'future-sky-dome') {
    return (
      <>
        <div
          style={shape({
            left: '10%',
            right: '10%',
            top: '6%',
            height: '56%',
            borderRadius: '50% 50% 18px 18px / 68% 68% 18px 18px',
            border: `4px solid ${theme.frame}`,
            background:
              'radial-gradient(circle at 50% 18%, rgba(133, 241, 255, 0.38) 0%, rgba(255,255,255,0.08) 42%, rgba(255,255,255,0.02) 100%)',
          })}
        />
        {[
          { left: '18%', top: '18%', size: 8 },
          { left: '28%', top: '14%', size: 6 },
          { left: '42%', top: '22%', size: 10 },
          { left: '58%', top: '12%', size: 7 },
          { left: '72%', top: '20%', size: 8 },
        ].map((star, index) => (
          <div
            key={`star-${index}`}
            style={shape({
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              borderRadius: '50%',
              background: '#f8fcff',
              boxShadow: `0 0 14px ${theme.accent}`,
            })}
          />
        ))}
        {[20, 36, 52, 68].map((left) => (
          <div
            key={`rib-${left}`}
            style={shape({
              left: `${left}%`,
              top: '8%',
              width: 2,
              height: '52%',
              background: theme.frame,
              opacity: 0.42,
            })}
          />
        ))}
        <div
          style={shape({
            left: '50%',
            bottom: '24%',
            transform: 'translateX(-50%)',
            width: 136,
            height: 24,
            borderRadius: 999,
            background: 'rgba(133, 241, 255, 0.2)',
            border: `3px solid ${theme.accent}`,
          })}
        />
        {[22, 48, 74].map((left, index) => (
          <div
            key={`console-${left}`}
            style={shape({
              left: `${left}%`,
              bottom: `${14 + (index % 2) * 8}%`,
              width: 54,
              height: 36,
              borderRadius: 14,
              background: index === 1 ? '#d7e8ff' : '#b2c7f1',
              border: `3px solid ${theme.frame}`,
            })}
          />
        ))}
      </>
    );
  }

  return null;
};

const BuilderRoom = ({ house, onBack, onAddFurniture, onMoveFurniture }) => {
  const houseId = house?.id ?? null;
  const roomWidth = house?.room?.width ?? BUILDER_ROOM_GRID_SIZE * 10;
  const roomHeight = house?.room?.height ?? BUILDER_ROOM_GRID_SIZE * 7;
  const roomTheme = house?.roomTheme;
  const trayItems = getFurnitureCatalogForTheme(roomTheme?.id);
  const roomRef = useRef(null);
  const [dragState, setDragState] = useState(null);
  const [layoutMode, setLayoutMode] = useState(getRoomLayoutMode);

  useEffect(() => {
    const visualViewport = window.visualViewport;
    const handleResize = () => {
      setLayoutMode(getRoomLayoutMode());
    };

    window.addEventListener('resize', handleResize);
    if (visualViewport) {
      visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (visualViewport) {
        visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  useEffect(() => {
    setDragState(null);
  }, [houseId]);

  useEffect(() => {
    if (!dragState || !roomRef.current) {
      return undefined;
    }

    const handlePointerMove = (event) => {
      if (event.pointerId !== dragState.pointerId || !roomRef.current) {
        return;
      }

      const dropState = getRoomDropState(
        roomRef.current,
        dragState.item,
        dragState.pointerOffset,
        event.clientX,
        event.clientY
      );

      setDragState((current) =>
        current && current.pointerId === event.pointerId
          ? {
              ...current,
              insideRoom: dropState.insideRoom,
              previewX: dropState.snapped.x,
              previewY: dropState.snapped.y,
            }
          : current
      );
    };

    const handlePointerUp = (event) => {
      if (event.pointerId !== dragState.pointerId) {
        return;
      }

      if (dragState.insideRoom) {
        if (dragState.source === 'tray') {
          onAddFurniture(houseId, dragState.item.typeId, {
            x: dragState.previewX,
            y: dragState.previewY,
          });
        } else {
          onMoveFurniture(houseId, dragState.item.id, {
            x: dragState.previewX,
            y: dragState.previewY,
          });
        }
      }

      setDragState(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [dragState, houseId, onAddFurniture, onMoveFurniture]);

  const beginTrayDrag = (furniture, event) => {
    event.preventDefault();

    setDragState({
      pointerId: event.pointerId,
      source: 'tray',
      item: {
        ...furniture,
        typeId: furniture.id,
      },
      pointerOffset: {
        x: furniture.width / 2,
        y: furniture.height / 2,
      },
      previewX: 0,
      previewY: 0,
      insideRoom: false,
    });
  };

  const beginPlacedItemDrag = (item, event) => {
    event.preventDefault();

    const bounds = event.currentTarget.getBoundingClientRect();
    setDragState({
      pointerId: event.pointerId,
      source: 'room',
      item,
      pointerOffset: {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      },
      previewX: item.x,
      previewY: item.y,
      insideRoom: true,
    });
  };

  const roomItems = [...(house?.room?.items ?? [])].sort((left, right) => left.y - right.y);

  return (
    <div
      style={{
        ...panelStyle,
        width: layoutMode.compact
          ? 'calc(100vw - 20px)'
          : 'min(1380px, calc(100vw - 24px))',
        maxHeight: layoutMode.compact ? 'calc(100dvh - 20px)' : 'calc(100dvh - 24px)',
        overflowY: 'auto',
        padding: layoutMode.compact ? '18px' : '24px',
        color: '#17345c',
      }}
    >
      <div
        style={{
          display: 'grid',
          gap: 18,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div>
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
              P2 Room Builder
            </div>
            <h2
              style={{
                fontSize: 'clamp(30px, 4vw, 46px)',
                lineHeight: 1.04,
                margin: 0,
                whiteSpace: 'pre-line',
              }}
            >
              {`${roomTheme?.name || house.name}\ninvites soft snaps`}
            </h2>
            <div style={{ marginTop: 8, fontSize: 15, opacity: 0.76 }}>
              {roomTheme?.tagline || 'storybook room shell'}
            </div>
          </div>
          <button id="builder-room-back-btn" type="button" onClick={onBack} style={actionButtonStyle}>
            Back To World
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: layoutMode.stacked
              ? '1fr'
              : 'minmax(0, 1fr) minmax(260px, 320px)',
            gap: 18,
            alignItems: 'start',
          }}
        >
          <div
            style={{
              padding: 18,
              borderRadius: 28,
              background: `linear-gradient(180deg, ${roomTheme?.skyTop || 'rgba(255,255,255,0.96)'}, ${
                roomTheme?.skyBottom || 'rgba(255,255,255,0.72)'
              } 54%, ${roomTheme?.floorTop || 'rgba(247, 222, 188, 0.96)'} 54%, ${
                roomTheme?.floorBottom || 'rgba(234, 193, 144, 0.96)'
              } 100%)`,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.82), 0 22px 44px rgba(15, 23, 42, 0.12)',
            }}
          >
            <div
              id="builder-room-grid"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: roomWidth + (layoutMode.compact ? 24 : 32),
                minHeight: roomHeight + (layoutMode.compact ? 24 : 32),
                margin: '0 auto',
                padding: layoutMode.compact ? 12 : 16,
                borderRadius: 24,
                background:
                  'linear-gradient(180deg, rgba(215, 238, 255, 0.42) 0%, rgba(255,255,255,0.22) 38%, rgba(255,255,255,0.08) 38%, rgba(0,0,0,0) 38%)',
              }}
            >
              <div
                ref={roomRef}
                style={{
                  position: 'relative',
                  width: roomWidth,
                  height: roomHeight,
                  margin: '0 auto',
                  borderRadius: 18,
                  overflow: 'hidden',
                  backgroundColor: roomTheme?.wallTop || '#fffdf8',
                  backgroundImage: `
                    linear-gradient(${roomTheme?.grid || 'rgba(23, 52, 92, 0.08)'} 1px, transparent 1px),
                    linear-gradient(90deg, ${roomTheme?.grid || 'rgba(23, 52, 92, 0.08)'} 1px, transparent 1px),
                    linear-gradient(180deg, ${roomTheme?.skyTop || '#f8fafc'} 0%, ${roomTheme?.skyBottom || '#ffffff'} 32%, ${roomTheme?.wallTop || '#fffdf8'} 32%, ${roomTheme?.wallBottom || '#f2e8d8'} 66%, ${roomTheme?.floorTop || '#d8b48a'} 66%, ${roomTheme?.floorBottom || '#8f6b4f'} 100%)
                  `,
                  backgroundSize: `${BUILDER_ROOM_GRID_SIZE}px ${BUILDER_ROOM_GRID_SIZE}px`,
                  boxShadow: dragState?.insideRoom
                    ? `inset 0 0 0 3px ${roomTheme?.accent || 'rgba(96, 165, 250, 0.34)'}`
                    : `inset 0 0 0 2px ${roomTheme?.frame || 'rgba(23, 52, 92, 0.08)'}`,
                  touchAction: 'none',
                }}
              >
                <RoomThemeScene theme={roomTheme} />

                {roomItems.map((item) => {
                  const isDragged = dragState?.source === 'room' && dragState.item.id === item.id;

                  return (
                    <button
                      key={item.id}
                      id={`builder-room-item-${item.id}`}
                      type="button"
                      onPointerDown={(event) => beginPlacedItemDrag(item, event)}
                      style={{
                        position: 'absolute',
                        left: item.x,
                        top: item.y,
                        width: item.width,
                        height: item.height,
                        border: 0,
                        padding: 0,
                        background: 'transparent',
                        cursor: 'grab',
                        opacity: isDragged ? 0.18 : 1,
                        touchAction: 'none',
                        userSelect: 'none',
                      }}
                      aria-label={`Move ${item.name}`}
                    >
                      <FurnitureArt item={item} />
                    </button>
                  );
                })}

                {dragState?.insideRoom && (
                  <div
                    style={{
                      position: 'absolute',
                      left: dragState.previewX,
                      top: dragState.previewY,
                      width: dragState.item.width,
                      height: dragState.item.height,
                      pointerEvents: 'none',
                      zIndex: 20,
                    }}
                  >
                    <FurnitureArt item={dragState.item} ghost />
                  </div>
                )}

                {roomItems.length === 0 && !dragState?.insideRoom && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      whiteSpace: 'pre-line',
                      fontSize: 18,
                      fontWeight: 700,
                      lineHeight: 1.25,
                      color: '#48627f',
                    }}
                  >
                    {'Drag a tray friend\ninto the room\nand let it snap'}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gap: 14,
            }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.62)',
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
              Room Rules
            </div>
            <div style={{ whiteSpace: 'pre-line', lineHeight: 1.34, fontSize: 15 }}>
                {'Drag from the tray.\nDrop inside the scene.\nEverything snaps to 32.'}
            </div>
          </div>

          <div
            style={{
                background: 'rgba(255,255,255,0.62)',
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
              Furnished Tonight
            </div>
            <div style={{ fontSize: 34, fontWeight: 800 }}>{roomItems.length}</div>
            <div style={{ marginTop: 4, fontSize: 15 }}>
              {roomItems.length === 1 ? 'room piece' : 'room pieces'}
            </div>
          </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.62)',
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
                Room Theme
              </div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>
                {roomTheme?.name || house.name}
              </div>
              <div style={{ marginTop: 4, fontSize: 14, lineHeight: 1.34, opacity: 0.78 }}>
                {roomTheme?.tagline || 'storybook space'}
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.62)',
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
                Starter Tray
              </div>
              {trayItems.map((furniture) => (
                <button
                  key={furniture.id}
                  id={`builder-tray-${furniture.id}`}
                  type="button"
                  onPointerDown={(event) => beginTrayDrag(furniture, event)}
                  style={dragCardStyle}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      background: 'rgba(248, 250, 252, 0.96)',
                      boxShadow: 'inset 0 0 0 1px rgba(23, 52, 92, 0.08)',
                      flexShrink: 0,
                    }}
                  >
                    <FurnitureArt
                      item={{
                        ...furniture,
                        typeId: furniture.id,
                      }}
                    />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 15, fontWeight: 800 }}>{furniture.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.72 }}>drag into room</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderRoom;
