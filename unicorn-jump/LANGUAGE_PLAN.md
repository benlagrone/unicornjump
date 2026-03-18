# Language Plan

## Goal

Reduce complex sentences in the live game copy and move display names toward short Germanic roots, with Latin-root terms used only where they clearly teach a repeatable pattern.

This plan is meant to improve:

- reading ease for young players
- consistency across UI, dialog, and quest text
- vocabulary learning through repeated roots
- naming clarity without breaking ids, saves, or asset paths

## Active Surfaces

The main files this plan should touch are:

- `src/haikuText.js` for shared UI text, HUD text, helper text, and dialog copy
- `src/biomeManager.js` for biome names, creature names, quest item names, gate names, greetings, prompts, and thanks text
- `src/dialogSystem.js` for the shared dialog entry points

## Track A: Sentence Simplification

### Rules

Use these rules for all player-facing English:

- One idea per line.
- One action per sentence.
- Prefer one clause over cause-and-effect chains.
- Put the key verb near the front.
- Put numbers first when they matter.
- Prefer short concrete words over abstract words.
- Avoid stacked adjectives.
- Avoid filler phrases that do not change the action.
- Keep repetition intentional and useful.

### Length Targets

- Buttons and titles: 1 to 3 words
- HUD labels: 1 to 2 words
- Instruction lines: 3 to 6 words when possible
- Dialog lines: 4 to 8 words when possible
- Three-line blocks: each line should stand on its own

### Preferred Core Vocabulary

Use the same short verbs everywhere:

- `jump`
- `help`
- `find`
- `open`
- `go`
- `save`
- `light`
- `rest`
- `start`

Use the same short nouns everywhere:

- `world`
- `land`
- `path`
- `gate`
- `friend`
- `seed`
- `song`
- `star`
- `leaf`
- `wind`
- `light`

### Avoid

Avoid these patterns in live copy:

- `Could you ... so that ...`
- `Would you ... so the ... can ...`
- `Please ... and then ... and then ...`
- one line that mixes instruction, lore, and reward
- one line that mixes emotion, action, and destination

### Rewrite Order

Apply simplification in this order:

1. Buttons, titles, and HUD labels
2. Control instructions and quest instructions
3. Intro, reminder, and completion dialog
4. Biome descriptions and helper text
5. Longer roadmap and guide docs

### Example Rewrites

These are style targets, not final locked strings:

- `Could you gather 3 lantern seeds so the valley can glow tonight?`
  becomes
  `Find 3 light seeds.`
  `Help Lightvale glow.`

- `Would you gather 3 sun drops so the orchard can ripen its fruit?`
  becomes
  `Find 3 sun drops.`
  `Help Sungrove ripen.`

- `The valley shines again. Please carry my guiding light onward.`
  becomes
  `The vale shines again.`
  `Take this guide light.`

## Track B: Root-Based Naming

### Naming Rules

- Keep internal ids unchanged in phase 1.
- Change display strings before changing any ids.
- Prefer Germanic-root names for the main gameplay surface.
- Use Latin-root terms only for special lore, powers, or optional teaching moments.
- Use one root family per biome.
- Keep names short enough to fit existing UI.
- Do not rename a word that is already short, concrete, and teachable.

### Recommended Naming Split

Use Germanic roots for:

- biome names
- gate names
- quest item names
- core actions
- HUD labels
- creature and companion display names

Use Latin roots sparingly for:

- optional lore words
- special power labels
- glossary or helper cards
- advanced word-learning layers added later

### Keep For Now

These are already short and teachable:

- `Unicorn Jump`
- `World Map`
- `Songbird`
- `firefly`
- `windmill`
- `fox`
- `sheep`
- `bird`
- `gate`
- `jump`
- `help`
- `find`

### Priority Rename Sheet

These are first-pass candidate renames for display strings.

| Surface | Current | Candidate | Root Track | Reason |
| --- | --- | --- | --- | --- |
| biome | Lantern Bamboo Valley | Lightvale | Germanic | shorter and easier to repeat |
| biome | Highland Meadow | Heathermead | Germanic | keeps landscape cue with shorter form |
| biome | Storybook Forest | Talewood | Germanic | simpler compound, keeps tale + wood |
| biome | Sun Orchard | Sungrove | Germanic | shorter and easier in UI |
| biome | Bluebonnet Prairie | Bluebloom Plain | Germanic | more transparent than prairie |
| gate | Lantern Gate | Light Gate | Germanic | direct word, easier than lantern |
| gate | Heather Arch | Heather Gate | Germanic | keeps plant cue and simplifies form |
| gate | Story Arch | Tale Gate | Germanic | aligns with Talewood |
| gate | Golden Arbor | Gold Gate | Germanic | simpler than arbor |
| gate | Prairie Gate | Field Gate | Germanic | simpler than prairie |
| creature | Lantern Fox | Light Fox | Germanic | direct cue |
| creature | Highland Sheep | Hill Sheep | Germanic | shorter and easier to parse |
| creature | Story Gnome | Tale Gnome | Germanic | aligns with biome rename |
| creature | Orchard Bird | Sun Bird | Germanic | simpler cue |
| creature | Prairie Armadillo | Field Armadillo | Germanic | simpler place word |
| companion | Glow Fox | Gleam Fox | Germanic | tighter root family |
| companion | Butterfly Spirit | Butterfly Wisp | Germanic | simpler fantasy term |
| quest item | lantern seed | light seed | Germanic | direct and teachable |
| quest item | meadow song | wind song | Germanic | clearer action tie |
| quest item | story star | tale star | Germanic | aligns with Talewood |
| quest item | sun drop | sun drop | keep | already strong |
| quest item | firefly | firefly | keep | already strong |
| UI title | World Progress | World Path | Germanic | more concrete |
| UI title | Total Harmony | Song Total | Germanic | less abstract |
| UI title | Biome Restored | Land Healed | Germanic | more concrete |
| UI title | Travel On | Go On | Germanic | shorter verb |
| UI title | Final Harmony | Last Song | Germanic | less abstract |
| settings | Sound Effects | Sound | Germanic | shorter |
| settings | Background Music | Music | Germanic | shorter |

### Latin Root Bank

If a second teaching layer is added later, reuse a small Latin-root bank instead of inventing new terms:

- `lumen` for light
- `vent` or `ventus` for wind
- `flora` for plant growth
- `vita` for life
- `sonus` for sound

These should be optional terms, not replacements for the clearest main UI words.

## Execution Plan

### Phase 0: Lock Rules

- approve the sentence rules above
- approve Germanic-first naming for main gameplay
- keep ids stable in this phase

### Phase 1: Simplify High-Frequency UI Copy

Update shared copy first in `src/haikuText.js`:

- menu titles
- world map labels
- settings titles
- HUD titles
- quest instruction text
- controls text
- pause and completion text

Success criteria:

- every high-frequency label fits without wrapping badly
- the same action always uses the same verb
- no instruction line contains more than one action

### Phase 2: Rename Display Names In Biome Data

Update display strings in `src/biomeManager.js`:

- biome names
- short biome names
- gate names
- creature names
- companion names
- quest item names

Do not change:

- biome ids
- quest ids
- effect ids
- asset folder names
- save keys

Success criteria:

- UI labels still fit
- progress and save data still load
- no code paths depend on display names for logic

### Phase 3: Rewrite Dialog To Match New Names

After phase 2, rewrite:

- greetings
- quest prompts
- reminders
- thanks text
- helper haikus
- completion lines

Success criteria:

- dialog uses the same root family as the biome
- each line can be read alone
- no dialog line mixes action and reward in a confusing way

### Phase 4: Verification

Verify these surfaces with screenshots and state checks:

- menu
- settings
- HUD
- landing screen
- quest prompt
- goal banner
- pause overlay
- biome completion
- final completion

Success criteria:

- names fit all cards and buttons
- simpler copy still feels warm
- root patterns are visible and repeated

## Recommended Next Step

Start with a narrow first pass:

1. simplify the shared UI labels and instruction text in `src/haikuText.js`
2. rename only the biome, gate, and quest-item display strings in `src/biomeManager.js`
3. leave ids, assets, and save keys alone

That gives the biggest language benefit with the lowest regression risk.
