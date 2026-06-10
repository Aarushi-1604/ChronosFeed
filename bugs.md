# ChronosFeed Project: Bugs & Development Hurdles Report

This document details resolved issues, active bugs, and potential future hurdles/bottlenecks in the ChronosFeed codebase.

---

## 1. Status Mismatch causing Infinite Polling [RESOLVED ON THIS BRANCH]
* **Issue**: The backend database sets a world's status to `'failed'` if generation fails. However, the frontend polling hook and landing page transition checks were only looking for `'error'`. When generation failed, the frontend kept polling the backend indefinitely, freezing the landing screen in a "Calibrating..." loading loop.
* **File Path**: 
  - [`frontend/src/hooks/useWorldStatus.ts`](file:///d:/ChronosFeed-main/ChronosFeed-main/frontend/src/hooks/useWorldStatus.ts)
  - [`frontend/src/lib/api.ts`](file:///d:/ChronosFeed-main/ChronosFeed-main/frontend/src/lib/api.ts)
  - [`frontend/src/types/index.ts`](file:///d:/ChronosFeed-main/ChronosFeed-main/frontend/src/types/index.ts)
* **How to Fix**:
  - In `api.ts` and `types/index.ts`, expand the type union of `status` to include `'failed'`.
  - In the polling hook `useWorldStatus.ts`, map the backend status `'failed'` to the frontend status `'error'` to gracefully exit the polling loop, reset loading states, and alert the user.

---

## 2. Hard Crash on Missing Environment Variables
* **Issue**: The backend codebase crashes immediately upon booting if `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is not set in the environment. This blocks local setup and makes developers unable to boot even a mocked version of the server.
* **File Path**: [`backend/src/lib/supabase.ts`](file:///d:/ChronosFeed-main/ChronosFeed-main/backend/src/lib/supabase.ts)
* **Code Location (Lines 9-13)**:
  ```typescript
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.'
    );
  }
  ```
* **How to Fix**: 
  - Instead of throwing a fatal error and crashing the server process, catch this condition and log a diagnostic warning.
  - Implement a mocked service fallback or database stub service so developers can boot the server in "offline mode" for local UI testing.

---

## 3. Gemini API Safety Filter Blocks (Immediate Generation Failure)
* **Issue**: Content policy filters in the Google Gemini API automatically block requests containing sensitive historical words (e.g., "Hitler", specific war conflicts, or sensitive political terms). When blocked, `callGemini` throws an unhandled exception, causing the backend to mark the world status as `'failed'` instantly without explanation.
* **File Path**: [`backend/src/services/geminiService.ts`](file:///d:/ChronosFeed-main/ChronosFeed-main/backend/src/services/geminiService.ts)
* **Code Location (Lines 70-95)**:
  ```typescript
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  ```
* **How to Fix**:
  - Configure the model initialization to lower safety thresholds if the API policy permits:
    ```typescript
    const model = genAI.getGenerativeModel({
      model: modelName,
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_NONE",
        },
        // Repeat for other safety categories
      ]
    });
    ```
  - Alternatively, implement validation in `backend/src/controllers/worldController.ts` or the frontend to reject known sensitive words before calling the AI generation pipeline.

---

## 4. Fragile JSON Extraction (`cleanJSON` Parser Failure)
* **Issue**: The backend relies on a custom string slicing helper `cleanJSON` to extract JSON from Gemini's response. If Gemini prepends any introductory text, appends trailing commentary, or formats markdown code blocks slightly differently (e.g. lowercase ````json` vs uppercase ````JSON`), `JSON.parse` will throw a syntax error, causing the world generation to fail.
* **File Path**: [`backend/src/services/geminiService.ts`](file:///d:/ChronosFeed-main/ChronosFeed-main/backend/src/services/geminiService.ts)
* **Code Location (Lines 13-62)**:
  ```typescript
  export function cleanJSON(text: string): string { ... }
  ```
* **How to Fix**:
  - Transition the backend to use Gemini's native **Structured Outputs** feature by defining a JSON schema. This forces Gemini to return guaranteed valid JSON fitting the schema exactly, removing the need for fragile regex/substring slicing:
    ```typescript
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: worldGenesisSchema,
      }
    });
    ```

---

## 5. Overproduction of API Call Costs & No Rate-Limiting
* **Issue**: The `createWorld` endpoint does not have rate-limiting. A user could spam the endpoint, leading to massive database bloating and runaway costs from Google Gemini API calls.
* **File Path**: [`backend/src/routes/worlds.ts`](file:///d:/ChronosFeed-main/ChronosFeed-main/backend/src/routes/worlds.ts)
* **How to Fix**:
  - Implement a rate-limiting middleware such as `express-rate-limit` to restrict the number of compilations a user can request per hour:
    ```typescript
    import rateLimit from 'express-rate-limit';
    const compileLimiter = rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 5, // Limit each IP to 5 compilations per hour
      message: 'Too many realities compiled from this IP. Please try again later.'
    });
    router.post('/', requireFields(['prompt']), compileLimiter, createWorld);
    ```

---

## 6. Fire-and-Forget Silent Failures in World Controller
* **Issue**: When a compilation starts, the backend sends a `202 Accepted` response to the client immediately and kicks off `generateWorld` asynchronously. If `generateWorld` fails during the initial DB lookup or setup stage, the client only finds out through polling the status.
* **File Path**: [`backend/src/controllers/worldController.ts`](file:///d:/ChronosFeed-main/ChronosFeed-main/backend/src/controllers/worldController.ts)
* **Code Location (Lines 15-18)**:
  ```typescript
  // Fire and forget — do not await, do not block the response
  generateWorld(world.id, prompt.trim()).catch((err: Error) => {
    console.error('[GENERATION] Pipeline failed for world:', world.id, err.message);
  });
  ```
* **How to Fix**:
  - Validate credentials and service health before sending the `202` response, or register the error into a table so the client can query the specific error message instead of receiving a generic `'failed'` status.
