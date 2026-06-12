# ChronosFeed — System Updates & Simulation Engine Rework
This document details all recent architectural updates, new features, model changes, API configurations, and future development roadmaps for **ChronosFeed**.

---

## ⚓ 1. Core Simulation Engine: Reality-Anchored Rework
To prevent the simulation from drifting into pure fantasy, the generation prompts have been completely restructured around the **Reality-Anchored Simulation Model**.

*   **The Principle**: When a divergence is entered, the engine alters *only* the specific person, event, organization, or technology named in the prompt. All other real-world governments, media, companies, and historical timelines remain intact unless logically influenced.
*   **The 3 Simulation Modes**:
    1.  ⚓ **Reality Anchored** (`anchored`): Strict containment of the divergence. Real organizations (UN, NATO), nations, and public figures exist exactly as they do in reality.
    2.  🌊 **Ripple Mode** (`ripple`): The divergence cascades to logically affected entities (alliances shift, stock markets react) while leaving unrelated regions untouched.
    3.  ⚡ **Chaos Mode** (`chaos`): Maximum butterfly effect. The divergence triggers unpredictable disruptions across global power structures.

---

## 🛠️ 2. File-by-File AI Prompt Rework (`ai-lab/prompts/`)
All prompt templates have been rewritten to implement the reality-anchored rules, voice structures, and schema formats:

*   [`world_genesis.txt`](file:///d:/ChronosFeed-main/ChronosFeed-main/ai-lab/prompts/world_genesis.txt): Injects mode-specific instructions (`{{REALITY_MODE_INSTRUCTIONS}}`). Now returns structured JSON with a `divergence` summary and a list of `reality_anchors` (real entities that must remain unchanged). Generates 6 core historical timeline events.
*   [`persona.txt`](file:///d:/ChronosFeed-main/ChronosFeed-main/ai-lab/prompts/persona.txt): Creates 6 real-world/alternate-timeline personas. Forces inclusion of real-world figures mentioned in the divergence prompt plus a diverse mix of voices (1 journalist, 1 analyst, 1 ordinary citizen).
*   [`post.txt`](file:///d:/ChronosFeed-main/ChronosFeed-main/ai-lab/prompts/post.txt): Instructs AI to produce 12 posts (minimum 7 with image prompts) mimicking distinct real-world voices (e.g., Donald Trump's exclamation styles, Narendra Modi's formal/patriotic tone, Elon Musk's meme/tech language).
*   [`news.txt`](file:///d:/ChronosFeed-main/ChronosFeed-main/ai-lab/prompts/news.txt): Generates 6 news articles with quotes from real global outlets (Reuters, CNN, AP) reacting to the divergence.
*   [`ads.txt`](file:///d:/ChronosFeed-main/ChronosFeed-main/ai-lab/prompts/ads.txt): Generates 4 contextually-grounded advertisements that mix real-world brands with divergence consequences.
*   [`comment.txt`](file:///d:/ChronosFeed-main/ChronosFeed-main/ai-lab/prompts/comment.txt): Generates realistic reaction threads on posts, containing supportive, critical, and analytical stances.

---

## ⚙️ 3. Backend Engine Upgrades (`backend/src/services/`)
*   **Mode Parsing**: Added `parseModeFromPrompt()` in `generationService.ts` to automatically extract the mode prefix `[Mode: anchored/ripple/chaos]` prepended by the frontend.
*   **Gemini Model Update**: Updated the model configuration from deprecated/unsupported names to **`gemini-2.5-flash-lite`** in both `.env` and `geminiService.ts` to restore API communication.
*   **No-Key Image Generation Pipeline**: Created `buildPollinationsUrl()` to convert AI-generated image descriptions into high-quality, nologo, enhanced URLs via `Pollinations.ai`:
    ```typescript
    https://image.pollinations.ai/prompt/{encoded_prompt}?width=600&height=400&nologo=true&enhance=true
    ```
*   **Graceful Database Fallbacks**: 
    - The backend handles Supabase schema mismatches gracefully. For instance, if the `news` table doesn't contain an `image_url` column, the backend catches the error and retries the insertion without the image column, preventing generation crashes.
    - If comment generation hits Gemini API rate limits, it logs the warning and marks the world as `ready` instead of throwing a fatal error.

---

## 🎨 4. Frontend & User Interface Rework (`frontend/src/app/`)
*   **Interactive Selector**: Placed a 3-tab newspaper-grid Reality Mode Selector between the tagline and the input box.
*   **Micro-Animations**: Uses Framer Motion to transition descriptions smoothly as different simulation modes are highlighted.
*   **8 Sandbox Presets**: Added diverse historical, political, and fictional preset cards (e.g., Tanjiro Jaipur scenario, Tesla War of Currents, Library of Alexandria) to demonstrate engine capabilities.
*   **Hydration Mismatch Fixes**:
    - Avoided locale-dependent SSR discrepancies by wrapping header dates (`toLocaleDateString`) inside a client-side mounting effect (`useState` + `useEffect`).
    - Added `suppressHydrationWarning` to parent `<html>`/`<body>` nodes and interactive form tags to silence React hydration warnings caused by browser extensions injecting attributes (like Grammarly's `data-gr-*` or FormDirector's `fdprocessedid`).
*   **Inline Newspaper Error Banners**: Replaced standard JS alerts with retro, period-themed inline warnings (*"The Babbage Engine encountered a fault..."*) when world compilation fails.
*   **Simplified Feed Stream (Pagination Removal)**: Removed IntersectionObserver-based infinite scroll pagination. The feed column now loads all posts (up to 100) instantly on initial load, preventing UI loading indicator freezes and enhancing layout usability.

---

## 🔑 5. API Model and Quota Telemetry
The project uses the Google Gemini API free-tier credentials.

| Parameter | Value / Limit |
|---|---|
| **Active Model** | `gemini-2.5-flash-lite` |
| **Requests Per Minute (RPM)** | 10 RPM |
| **Requests Per Day (RPD)** | 1,500 RPD |
| **Tokens Per Minute (TPM)** | 1,000,000 TPM |

### Rate Limit Warnings
*   **Comment Generation Loop**: Since a full world generation requires 1 request for world genesis, 1 for personas, 1 for posts, 1 for news, 1 for ads, and 5 separate sequential comment generation requests, it can consume up to 10 requests in a short period.
*   **Handling**: A `5000ms` delay is added between comment requests. If Gemini throws a `429 Too Many Requests` error, the comment loop will log the error and skip comments, allowing the world status to finalize as `ready` so that the user's timeline renders immediately.

---

## ⚠️ 6. Developer Warnings & Security Protocols
1.  **Git/Github Security**: Do **NOT** push changes to remote git branches or commit secrets. The `.env` keys must remain localized on this system.
2.  **Supabase Connection**: Ensure your Supabase service role key remains valid and does not expire, otherwise database inserts for new timelines will fail.

---

## 🚀 7. Future Roadmap Recommendations
*   **API Queue Manager**: Implement a token bucket or queue scheduler in the backend to serialize Gemini API calls, spreading comment generation over a larger window to completely avoid `429` rate-limit errors.
*   **Database Migrations**: Add the `image_url` column to the `news` table in the Supabase schema to render custom Pollinations.ai graphics for news updates:
    ```sql
    ALTER TABLE news ADD COLUMN image_url TEXT;
    ```
*   **Mobile Right Sidebar Optimization**: Continue optimizing viewport scroll limits for smaller screen sizes.
