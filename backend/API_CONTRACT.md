# ChronosFeed API Contract
**Base URL (local):** `http://localhost:3001`
**Base URL (production):** TBD after Railway deploy
**Content-Type:** `application/json` for all requests and responses
**Version:** v1

---

## Standard Error Format
All errors return this shape. No exceptions.
```json
{
  "error": "Human-readable message describing what went wrong"
}
```

## Standard Success Format
All successful responses return this shape:
```json
{
  "data": { ... },
  "message": "optional human-readable success message"
}
```

---

## 1. Health

### GET /health
No input required.
```json
{
  "status": "ok",
  "timestamp": "2026-06-08T10:00:00.000Z",
  "service": "chronosfeed-backend"
}
```

---

## 2. Worlds

### POST /api/worlds
Accepts a historical divergence prompt. Creates a World row with status "generating", triggers the async AI generation pipeline, and immediately returns the worldId. The frontend polls GET /api/worlds/:id until status is "ready".

**Request body:**
```json
{
  "prompt": "What if the internet was invented in 1890?"
}
```

**Response 202:**
```json
{
  "data": {
    "worldId": "uuid-string",
    "status": "generating"
  },
  "message": "World generation started"
}
```

**Errors:**
- `400` — prompt is missing or empty
- `500` — database insert failed

---

### GET /api/worlds
Returns all worlds for the community gallery. Ordered by created_at descending.

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "prompt": "What if Rome never fell?",
      "name": "Imperium Nova",
      "summary": "Short paragraph...",
      "era": "Modern Antiquity",
      "tech_level": "Steam-powered computation",
      "gov_type": "Senatorial Republic",
      "status": "ready",
      "created_at": "2026-06-08T10:00:00.000Z"
    }
  ]
}
```

**Errors:**
- `500` — database query failed

---

### GET /api/worlds/:id
Fetch a single world with its events array. Used by frontend to render the timeline sidebar and check generation status.

**Response 200:**
```json
{
  "data": {
    "id": "uuid",
    "prompt": "What if Rome never fell?",
    "name": "Imperium Nova",
    "summary": "...",
    "era": "Modern Antiquity",
    "tech_level": "...",
    "gov_type": "...",
    "status": "ready",
    "created_at": "2026-06-08T10:00:00.000Z",
    "updated_at": "2026-06-08T10:00:30.000Z",
    "events": [
      {
        "id": "uuid",
        "world_id": "uuid",
        "year": "476 AD",
        "title": "Rome Holds",
        "description": "...",
        "impact": "..."
      }
    ]
  }
}
```

**Errors:**
- `404` — world not found
- `500` — database query failed

---

## 3. Feed

### GET /api/worlds/:id/feed
Returns paginated posts for the infinite scroll feed. Each post includes its author persona.
Uses cursor-based pagination.

**Query params:**
- `limit` (optional, default: 10, max: 20)
- `cursor` (optional) — the `created_at` timestamp of the last post received

**Response 200:**
```json
{
  "data": {
    "posts": [
      {
        "id": "uuid",
        "world_id": "uuid",
        "persona_id": "uuid",
        "content": "Just upgraded the steam-router. 10 punch-cards per minute!",
        "media_url": null,
        "media_type": "TEXT",
        "likes_count": 420,
        "reposts_count": 17,
        "created_at": "2026-06-08T10:00:00.000Z",
        "persona": {
          "id": "uuid",
          "name": "Charles Babbage III",
          "handle": "steam_coder_99",
          "avatar": "",
          "role": "SCIENTIST",
          "influence_score": 87
        }
      }
    ],
    "nextCursor": "2026-06-08T09:00:00.000Z",
    "hasMore": true
  }
}
```

**Errors:**
- `404` — world not found
- `500` — database query failed

---

## 4. Personas

### GET /api/worlds/:id/personas
Returns all personas in a world. Used by the "Who to Follow" sidebar widget.

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "world_id": "uuid",
      "name": "Charles Babbage III",
      "handle": "steam_coder_99",
      "avatar": "",
      "bio": "Lead engineer at His Majesty's Steam-Net Registry.",
      "role": "SCIENTIST",
      "followers_count": 14200,
      "following_count": 88,
      "influence_score": 87,
      "interests": ["gears", "punch-cards", "tea"],
      "personality": "Eccentric, highly technical, easily excited"
    }
  ]
}
```

**Errors:**
- `404` — world not found
- `500` — database query failed

---

### GET /api/personas/:id
Returns a single persona and their last 20 posts. Used by the Profile page.

**Response 200:**
```json
{
  "data": {
    "id": "uuid",
    "world_id": "uuid",
    "name": "Charles Babbage III",
    "handle": "steam_coder_99",
    "avatar": "",
    "bio": "...",
    "role": "SCIENTIST",
    "followers_count": 14200,
    "following_count": 88,
    "influence_score": 87,
    "interests": ["gears", "punch-cards", "tea"],
    "personality": "...",
    "posts": [
      {
        "id": "uuid",
        "content": "...",
        "media_url": null,
        "media_type": "TEXT",
        "likes_count": 420,
        "reposts_count": 17,
        "created_at": "2026-06-08T10:00:00.000Z"
      }
    ]
  }
}
```

**Errors:**
- `404` — persona not found
- `500` — database query failed

---

## 5. News

### GET /api/worlds/:id/news
Returns alternate-history news articles. Supports optional category filter.

**Query params:**
- `category` (optional) — one of: `POLITICS`, `SCIENCE`, `BUSINESS`, `CULTURE`, `TECHNOLOGY`

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "world_id": "uuid",
      "title": "Steam Parliament Passes Net Expansion Act",
      "content": "...",
      "category": "POLITICS",
      "publisher": "The Chronos Daily",
      "created_at": "2026-06-08T10:00:00.000Z"
    }
  ]
}
```

**Errors:**
- `404` — world not found
- `500` — database query failed

---

## 6. Ads

### GET /api/worlds/:id/ads
Returns alternate-era advertisements for the world.

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "world_id": "uuid",
      "company_name": "BabbageCo Steam Solutions",
      "tagline": "Compute at the speed of steam.",
      "description": "...",
      "image_url": null,
      "price": "3 Sovereigns",
      "created_at": "2026-06-08T10:00:00.000Z"
    }
  ]
}
```

**Errors:**
- `404` — world not found
- `500` — database query failed

---

## Pagination Notes (for Aditya)
- Always send the `cursor` from `nextCursor` in the previous response as a query param in the next request
- When `hasMore` is `false`, stop fetching
- When `cursor` is absent, the backend returns the most recent posts

## Field Name Convention (for Yeshwanth)
All JSON output from AI prompts must use **snake_case** matching these exact field names. No camelCase. No renaming.

**Base URL (production):** https://chronosfeed-production.up.railway.app