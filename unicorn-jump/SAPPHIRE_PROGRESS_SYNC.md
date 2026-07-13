# Sapphire Progress Sync

Sapphire's World stores progress locally by default, then syncs it when a
progress API is configured.

## Client Configuration

Set this for web builds that should sync between devices:

```bash
REACT_APP_SAPPHIRE_PROGRESS_API=https://your-api.example.com
```

When unset, the app stays local-only and uses browser storage.

## Profile Selection

The app defaults to the `sapphire` profile. To switch a browser/device, open:

```text
https://sapphirelagrone.com/?profile=sapphire
```

The selected profile is saved in local storage. Future parent mode should own
profile switching and PIN-gated settings.

## API Contract

The sync client expects:

```http
GET /profiles/:profileId/progress
PUT /profiles/:profileId/progress
```

The payload shape is:

```json
{
  "profileId": "sapphire",
  "deviceId": "device-id",
  "highScore": 120,
  "journey": {
    "currentBiomeIndex": 1,
    "completedBiomeIds": ["lantern-bamboo-valley"]
  },
  "summerState": {
    "dateKey": "2026-06-12",
    "stars": 6,
    "completedQuestIds": ["sing-chinese-song"],
    "unicornRuns": 2
  },
  "updatedAt": "2026-06-12T15:30:00.000Z"
}
```

The current client merge policy is intentionally simple:

- high score uses the maximum known score
- completed worlds and daily quests are unioned
- stars use the highest known value
- the app continues offline if the API is unavailable

For production parent rewards, the server should eventually keep an append-only
star ledger so earning and spending stars cannot conflict across devices.
