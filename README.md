# A Birthday Wish 🎂

An interactive, personalized birthday-wish experience: verify identity → swipe
through sweet moments → open a heartfelt letter → reveal a rose bouquet →
blow out a candle → pop balloons → confetti finale.

- **Frontend**: React + Vite + Tailwind + Framer Motion (`/frontend`)
- **Backend**: Node.js + Express + MongoDB, for centralized storage so you
  can create and share multiple wishes, each with its own link (`/backend`)

The frontend works standalone with sample data even without the backend, so
you can preview and customize it in minutes, then add the backend when you
want multiple shareable, persisted wishes.

---

## 1. Project structure

```
birthday-wish-app/
├── frontend/          React app (what visitors see)
│   └── src/
│       ├── scenes/    One component per moment (verify, moments, message, bouquet, candle, balloons, final)
│       └── data/wishConfig.js   Sample content — edit this to personalize quickly
└── backend/           Express API + MongoDB (centralized storage for many wishes)
    ├── models/Wish.js
    └── routes/wishes.js
```

---

## 2. Run it locally (fastest path — no backend needed)

```bash
cd frontend
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). This uses the
sample data in `frontend/src/data/wishConfig.js`. Edit that file — the
recipient's name, the verify question, photo URLs/captions, the message text,
and the 4 balloon words — and the page hot-reloads with your changes.

Swap the `photos[].src` values for real photo URLs (upload them anywhere
public, e.g. Cloudinary, Imgur, or your own hosting — see step 5).

---

## 3. Run the backend locally (for multiple, shareable, saved wishes)

The backend lets you create many different wishes (one per birthday
person), each saved centrally in MongoDB and accessible at its own link,
e.g. `yourapp.com/aanya`.

1. **Create a free MongoDB Atlas cluster**: [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) → "Build a database" → free M0 tier → create a database user → under "Network Access" allow `0.0.0.0/0` (or your IP) → copy the connection string.

1b. **Create a free Cloudinary account** (for photo uploads): [cloudinary.com/users/register/free](https://cloudinary.com/users/register/free) → after signup, your Dashboard shows **Cloud name**, **API Key**, and **API Secret** — copy all three. This is what makes the "upload a photo" button in the Moments scene work: photos get stored here permanently and served globally, instead of living only on whichever device uploaded them.

2. **Configure and start the backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # paste your MongoDB connection string into MONGO_URI in .env
   # paste your Cloudinary Cloud name / API Key / API Secret into .env
   npm run seed   # inserts one sample wish at slug "sample"
   npm run dev
   ```
   The API runs at `http://localhost:4000`. Check `http://localhost:4000/api/health`.

3. **Point the frontend at it:**
   ```bash
   cd frontend
   cp .env.example .env
   # set VITE_API_URL=http://localhost:4000
   npm run dev
   ```
   Now visit `http://localhost:5173/sample` — that loads the wish from
   MongoDB instead of the local fallback file. On the Moments scene, tap the
   **+** button next to "Continue" to upload a photo — it uploads to
   Cloudinary, saves the link on the wish in MongoDB, and shows up
   immediately. Anyone opening `yourapp.com/sample` afterward — on any
   device, anywhere — sees that same photo, because it's stored centrally,
   not on your device.

4. **Create a new wish** by POSTing to the API (e.g. with `curl`, Postman, or
   a quick script):
   ```bash
   curl -X POST http://localhost:4000/api/wishes \
     -H "Content-Type: application/json" \
     -d '{
       "slug": "priya",
       "recipientName": "Priya",
       "senderName": "You",
       "passcode": "0704",
       "passcodeHint": "hint: my birth date, DDMM",
       "teaser": {
         "question": "I made something special for u, do u wanna see it?",
         "nudgeText": "Why did u click no!?",
         "nudgeButton": "Try again"
       },
       "reveal": {
         "heading": "Oh, it'\''s your birthday today!",
         "buttonText": "Yes"
       },
       "photos": [{ "src": "https://your-photo-url.com/1.jpg", "caption": "Our first trip" }],
       "message": "Dear Priya,\n\nHappy birthday...",
       "balloonWords": ["You", "are", "so", "loved"],
       "closingNote": "Made with love, just for you."
     }'
   ```
   The response includes `slug` — share `yourapp.com/priya` with that person.

---

## 4. Testing checklist before sharing

- Open the link on both desktop and a phone (most people will open this from
  a chat app) — the layout is mobile-first and responsive by default.
- Try both verify options to confirm the wrong one shakes and the right one
  proceeds.
- Swipe photo cards with touch/mouse drag and with the "Next" button.
- Confirm the letter, bouquet, candle-blow, and balloon-pop animations all
  run smoothly, then the confetti finale appears.
- If using the backend, confirm the link still works after a hard refresh
  (data persists in MongoDB, not just in memory).

---

## 5. Hosting it so anyone can open the link globally

**Recommended stack (all have generous free tiers):**

| Piece | Where | Why |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | Free, global CDN, auto HTTPS, deploys from GitHub in one click |
| Backend API | [Render](https://render.com) | Free Node.js web service |
| Database | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | Free M0 cluster, centralized, reachable from anywhere |
| Photos | [Cloudinary](https://cloudinary.com) free tier | Where uploaded photos actually live — the backend uploads to it automatically when someone uses the + button on the Moments scene |

### Step-by-step

1. **Push this project to GitHub** (one repo, both `frontend/` and `backend/` folders).

2. **Deploy the backend on Render:**
   - New → Web Service → connect your repo → set **Root Directory** to `backend`.
   - Build command: `npm install`. Start command: `npm start`.
   - Add environment variables: `MONGO_URI` (your Atlas connection string), `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (from your Cloudinary dashboard).
   - Deploy. You'll get a URL like `https://birthday-wish-api.onrender.com`.
   - Note: Render's free tier sleeps after inactivity, so the first request
     after idle time takes a few seconds to wake up — fine for a personal
     gift link.

3. **Deploy the frontend on Vercel:**
   - New Project → import the same repo → set **Root Directory** to `frontend`.
   - Framework preset: Vite (auto-detected).
   - Add environment variable `VITE_API_URL` = your Render backend URL from step 2.
   - Deploy. You'll get a URL like `https://birthday-wish.vercel.app`.
   - Optional: attach a custom domain in Vercel's project settings if you own one.

4. **Share the link:** `https://birthday-wish.vercel.app/priya` (or whatever
   slug you created) works for anyone, anywhere, on any device — no login
   needed.

5. **Add more people any time** by POSTing a new wish to your live backend
   URL (same `curl` example as step 3.4, but pointed at the Render URL) —
   no redeploy required, since it's all stored centrally in MongoDB.

### If you don't want a backend at all

You can skip steps 3 and just deploy `frontend/` alone to Vercel — it will
use the sample data baked into `wishConfig.js`. This is enough for a single,
one-off birthday link; you'd redeploy each time you want to change the
recipient/content.

---

## 6. Customizing the look

- Colors, fonts and shadows are defined in `frontend/tailwind.config.js`
  (`blush`, `rose`, `cream`, `gold`) and `frontend/index.html` (Google Fonts:
  Playfair Display, Dancing Script, Poppins).
- Each "moment" is its own file in `frontend/src/scenes/` — safe to edit
  independently (e.g. change candle colors in `CandleScene.jsx`, balloon
  colors in `BalloonScene.jsx`).
