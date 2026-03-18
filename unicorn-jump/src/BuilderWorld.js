import React from 'react';
import { BUILDER_WORLD_COLUMNS, getHouseById } from './builderState';

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

const getTileFill = (occupied) =>
  occupied
    ? 'linear-gradient(180deg, rgba(255, 248, 238, 0.98), rgba(255, 228, 192, 0.98))'
    : 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(234, 250, 236, 0.92))';

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

  return (
    <div
      style={{
        ...panelStyle,
        width: 'min(1180px, calc(100vw - 32px))',
        maxHeight: 'calc(100dvh - 32px)',
        overflowY: 'auto',
        padding: '26px',
        color: '#17345c',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(280px, 0.72fr)',
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
            {'Choose a wonder\nplace a dream house\nenter its world'}
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
            {`Tap any empty patch\na ${selectedHouseType.name.toLowerCase()} appears\ntap again to enter`}
          </p>

          <div
            style={{
              padding: 18,
              borderRadius: 28,
              background:
                'radial-gradient(circle at top, rgba(255,255,255,0.96), rgba(217, 245, 224, 0.72) 42%, rgba(172, 214, 186, 0.86) 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.74), 0 22px 44px rgba(15, 23, 42, 0.12)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${BUILDER_WORLD_COLUMNS}, minmax(0, 1fr))`,
                gap: 12,
              }}
            >
              {builderState.tiles.map((tile) => {
                const house = tile.houseId ? getHouseById(builderState, tile.houseId) : null;
                const occupied = Boolean(house);

                return (
                  <button
                    key={tile.id}
                    id={`builder-world-${tile.id}`}
                    type="button"
                    onClick={() => onTilePress(tile.id)}
                    style={{
                      aspectRatio: '1 / 1',
                      borderRadius: 24,
                      border: occupied
                        ? `2px solid ${house.palette.roofColor}`
                        : '1px solid rgba(23, 52, 92, 0.12)',
                      background: getTileFill(occupied),
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      boxShadow: occupied
                        ? `0 18px 28px ${house.palette.glowColor}`
                        : '0 12px 20px rgba(15, 23, 42, 0.08)',
                      padding: 10,
                    }}
                    aria-label={
                      occupied
                        ? `Enter ${house.name}`
                        : `Place house on tile ${tile.x + 1}, ${tile.y + 1}`
                    }
                  >
                    {occupied ? (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        <div
                          style={{
                            width: '78%',
                            maxWidth: 92,
                            aspectRatio: '1 / 1',
                            position: 'relative',
                          }}
                          >
                          <div
                            style={{
                              position: 'absolute',
                              left: '50%',
                              top: '2%',
                              transform: 'translateX(-50%)',
                              minWidth: 36,
                              padding: '4px 8px',
                              borderRadius: 999,
                              background: 'rgba(255,255,255,0.84)',
                              color: house.palette.trimColor,
                              fontSize: 11,
                              fontWeight: 900,
                              lineHeight: 1,
                              letterSpacing: 0.8,
                            }}
                          >
                            {house.shortLabel}
                          </div>
                          <div
                            style={{
                              position: 'absolute',
                              left: '8%',
                              right: '8%',
                              bottom: '12%',
                              height: '42%',
                              borderRadius: 18,
                              background: house.palette.wallColor,
                              border: `3px solid ${house.palette.trimColor}`,
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              left: '8%',
                              right: '8%',
                              top: '12%',
                              height: '34%',
                              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                              background: house.palette.roofColor,
                              filter: 'drop-shadow(0 5px 6px rgba(15, 23, 42, 0.12))',
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              left: '40%',
                              bottom: '12%',
                              width: '20%',
                              height: '22%',
                              borderRadius: 10,
                              background: '#f5c98a',
                              border: `2px solid ${house.palette.trimColor}`,
                            }}
                          />
                        </div>
                        <div
                          style={{
                            position: 'absolute',
                            left: 10,
                            right: 10,
                            bottom: 10,
                            fontSize: 11,
                            fontWeight: 800,
                            lineHeight: 1.15,
                            color: '#17345c',
                          }}
                        >
                          {house.name}
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: 'grid',
                          gap: 8,
                          justifyItems: 'center',
                          color: '#27543c',
                        }}
                      >
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: 30,
                            fontWeight: 500,
                            background: 'rgba(255,255,255,0.7)',
                            boxShadow: '0 8px 18px rgba(15, 23, 42, 0.08)',
                          }}
                        >
                          +
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 800, lineHeight: 1.15 }}>
                          {`Place\n${selectedHouseType.shortLabel}`}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
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
              Quick Rules
            </div>
            <div style={{ whiteSpace: 'pre-line', lineHeight: 1.34, fontSize: 15 }}>
              {'Pick a world style.\nEmpty patch means place.\nHouse patch means enter.'}
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
              Built Tonight
            </div>
            <div style={{ fontSize: 34, fontWeight: 800 }}>{builderState.houses.length}</div>
            <div style={{ marginTop: 4, fontSize: 15 }}>
              {builderState.houses.length === 1 ? 'storybook house' : 'storybook houses'}
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
                        ? 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255, 239, 220, 0.96))'
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
                      <div
                        style={{
                          minWidth: 38,
                          height: 38,
                          borderRadius: 12,
                          display: 'grid',
                          placeItems: 'center',
                          background: houseType.wallColor,
                          color: houseType.trimColor,
                          border: `2px solid ${houseType.roofColor}`,
                          fontSize: 12,
                          fontWeight: 900,
                          letterSpacing: 0.8,
                        }}
                      >
                        {houseType.shortLabel}
                      </div>
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
                    <div
                      style={{
                        minWidth: 32,
                        height: 32,
                        borderRadius: 10,
                        display: 'grid',
                        placeItems: 'center',
                        background: house.palette.wallColor,
                        color: house.palette.trimColor,
                        border: `2px solid ${house.palette.roofColor}`,
                        fontSize: 11,
                        fontWeight: 900,
                        letterSpacing: 0.7,
                      }}
                    >
                      {house.shortLabel}
                    </div>
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
