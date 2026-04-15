## Builder Room Menu Image Plan

Goal: replace the text-heavy builder-room chrome with compact visual cards that communicate action, mood, and status without repeating exposition.

### Phase 1: Replace instruction paragraphs with action tiles

- Turn `Quick Moves` into three icon tiles: move, chat, drag.
- Use existing runtime art instead of new copy-first UI:
  - `UnicornActorArt` for move.
  - `RoomNpcArt` for chat.
  - `FurnitureArt` for drag.
- Keep labels to 1-2 words under each icon: `Move`, `Chat`, `Place`.

### Phase 2: Collapse voice, mood, and echo into one visual pulse card

- Replace separate `Room Voice` and `Room Echo` copy blocks with one `Room Pulse` card.
- Show:
  - current speaker portrait,
  - one short line of active dialog,
  - one reaction badge for the current room echo.
- Use color and icon changes to communicate state instead of extra explanation.

### Phase 3: Convert cast list into portrait chips

- Replace the sidebar list rows with cast chips:
  - portrait,
  - name,
  - mood color.
- Show only the active cast by default.
- Move niceness/personality details into hover or tap detail, not the default view.

### Phase 4: Add theme hero art to the title card

- Add a small room-theme thumbnail to the top-left title card so the player reads the room at a glance.
- Extract a compact theme glyph per room from `RoomThemeScene`.
- Keep the title card to:
  - room name,
  - short tagline,
  - image.

### Phase 5: Make the dock more visual

- Turn dock items into image-first inventory cards:
  - larger furniture icon,
  - item name,
  - optional tiny category chip.
- Remove repeated helper copy like `drag into room` from every card.
- Keep the interaction hint once in the dock header.

### Phase 6: Define a small art system for menu chrome

- Add a dedicated `BuilderMenuArt` layer with reusable assets:
  - action glyphs,
  - theme glyphs,
  - portrait frames,
  - reaction badges.
- Reuse current room/furniture/actor rendering logic where possible before drawing new assets.

### Delivery order

1. Instruction tiles
2. Combined room pulse card
3. Cast portrait chips
4. Theme hero art
5. Dock card cleanup
6. Shared menu-art component pass

### Success criteria

- No repeated paragraphs that restate controls in multiple cards.
- Every persistent menu card has an image, glyph, or portrait.
- Default visible copy per card stays under two short lines.
- The builder room remains readable at laptop width without covering the play area.
