# Smart Creator AI

**Chat. Create. Build. Grow.**

An all-in-one AI workspace: chat, image generation, video generation, business idea
generator, content creator, voice assistant, resume maker, and a coding assistant —
with a modular backend so you can plug in any AI provider.

This is a real, working starter app:
- The frontend never talks to AI providers directly — it only calls your own
  Express backend at `/api/*`.
- No API keys are ever placed in frontend code.
- No feature fakes AI output. Every AI feature calls a real backend route; if no
  provider is configured, the UI clearly tells you so instead of pretending to work.

---

## 1. Project structure

```
smart-creator-ai/
  package.json
  vite.config.js
  .env.example
  client/
    index.html
    src/
      main.jsx
      App.jsx
      styles.css
      components/        (Chat, ImageGenerator, VideoGenerator, ...)
      services/          (api.js, storage.js)
  server/
    server.js
    routes/              (chat.js, image.js, video.js, business.js, content.js, code.js)
    providers/
      aiProvider.js      (the ONLY file that calls external AI APIs)
```

## 2. Install

```bash
npm install
```

## 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the provider(s) you want to use:

```
AI_PROVIDER=gemini            # or openai / anthropic / none
GEMINI_API_KEY=your_key_here
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

IMAGE_PROVIDER=none
IMAGE_API_KEY=

VIDEO_PROVIDER=none
VIDEO_API_KEY=
```

Until you add real keys, chat/business/content/code/resume features will return
a clear "provider not configured" message, and image/video generation will show
"not configured yet" instead of faking output. This is expected and by design.

`.env` is already in `.gitignore` — it will never be committed.

## 4. Run in development

This starts the Vite frontend (port 5173) and the Express backend (port 5000)
together, with the frontend proxying `/api` calls to the backend:

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

## 5. Build for production

```bash
npm run build
```

This outputs a static build to `/dist`. Run the backend separately in production:

```bash
npm start
```

Serve `/dist` with any static host (see deployment below), pointed at your
running backend.

---

## 6. Push to GitHub

1. Create a new repository on GitHub (no README/license, so it stays empty).
2. From this project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Smart Creator AI"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. Upload **everything except** `node_modules`, `dist`, and `.env` — your
   `.gitignore` already excludes these automatically.

## 7. Deploying

**Backend (Express, `server/`)** — deploy to any Node host: Render, Railway,
Fly.io, a VPS, etc. Set the same environment variables from your `.env` in that
host's dashboard (never upload `.env` itself).

**Frontend (`dist/` after `npm run build`)** — deploy to any static host:
Vercel, Netlify, GitHub Pages, Render Static Site, etc. Configure the host to
proxy or rewrite `/api/*` requests to your deployed backend's URL (or set an
absolute API base URL in `client/src/services/api.js` for production).

## 8. Connecting an AI provider later

All external AI calls live in **`server/providers/aiProvider.js`** — nothing
else in the app needs to change:

- To use **Google Gemini**: set `AI_PROVIDER=gemini` and `GEMINI_API_KEY` — this
  is already implemented.
- To use **OpenAI**: set `AI_PROVIDER=openai` and `OPENAI_API_KEY` — already
  implemented.
- To use **Anthropic**: set `AI_PROVIDER=anthropic` and `ANTHROPIC_API_KEY` —
  already implemented.
- For **image or video generation**, pick a provider (e.g. Stability AI,
  Replicate, Runway) and implement the `generateImage` / `generateVideo`
  functions in `aiProvider.js` following the pattern already used for text.

## 9. Data storage

Chat/content/project history is stored in the browser's `localStorage` via
`client/src/services/storage.js`, so the app works with zero database setup.
To move to a real database (Firebase, Supabase, Postgres, etc.), reimplement
the functions in that one file — every component already calls through it.

## 10. Notes

- Voice Assistant requests microphone permission only when you press the mic
  button, and only sends one message per finished spoken sentence.
- Dark/light theme is toggled in Settings and persisted locally.
- Mobile uses a bottom navigation bar; desktop (≥900px) uses a sidebar.
