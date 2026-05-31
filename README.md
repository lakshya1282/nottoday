# ⚡ NOT TODAY.

> **Quit bad habits by reinforcing discipline, one resisted urge at a time.**

**Not Today** is a mobile-first Progressive Web App (PWA) designed to help users break unwanted habits by celebrating their moments of self-control rather than logging their failures. Instead of tracking relapses, **Not Today** rewards you in the exact moment of temptation when you choose discipline.

Built using a state-of-the-art **Neubrutalist design system** inspired by Gen-Z internet culture, Duolingo's positive gamification, and BeReal's simplicity.

---

## 🌟 Key Features

* **💪 The Resistance Button**: A satisfying, physics-based "I DID NOT DO IT" button that triggers a physical depress animation, haptics/screen-shakes, pop-up progress indicators, and milestone confetti.
* **☁️ Robust Offline-first Sync**: Play unauthenticated or fully offline. If you rack up resisted urges while offline, they are automatically merged into your cloud account the moment you reconnect or log in.
* **🔒 Traditional & Social Authentication**: Instantly sign up or sign in using email + password (with zero-friction option) or Continue with Google.
* **🔥 Streak & Best Tracking**: Displays your current streak alongside your lifetime best score. Includes a relapse safety-net that resets your current counter but securely locks in your all-time high.
* **💬 main character energy**: Cycles through dynamic, playful, and high-energy motivational quotes designed to give you an instant dopamine boost.
* **📱 PWA Ready**: Installable on iOS and Android with automatic asset caching for a complete native-app experience.

---

## 🎨 Neubrutalist Design System

**Not Today** follows strict Neubrutalist design patterns:
* **Primary Background**: High-saturation Yellow (`#FADF0C`).
* **Primary Accent**: Bold Lavender/Purple (`#C7A4FF`).
* **Borders**: Chunky `4px solid black` on all interactive cards, inputs, and buttons.
* **Shadows**: Hard, high-contrast black shadows (`box-shadow: 4px 4px 0px #000`) with no blur.
* **Typography**: Highly oversized, confident headers using the **Space Grotesk** font.

---

## 🛠️ Technology Stack

* **Core**: [Next.js 16 (App Router + Turbopack)](https://nextjs.org/) & [React 19](https://react.dev/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Animations**: [Framer Motion](https://www.framer.com/motion/) & [Canvas Confetti](https://github.com/catdad/canvas-confetti)
* **Progressive Web App**: [@serwist/next](https://serwist.pages.dev/)
* **Backend & Auth**: [Supabase](https://supabase.com/) & [@supabase/ssr](https://supabase.com/docs/guides/auth/server-side/nextjs)

---

## 🚀 Getting Started

### 1. Clone the Project & Install Dependencies

```bash
git clone <your-repo-url>
cd nottoday
npm install
```

### 2. Configure Environment Variables

1. Copy the example file to create a local environment file:
   ```bash
   cp .env.local.example .env.local
   ```
2. Open `.env.local` and paste in your Supabase credentials:
   ```ini
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-api-key
   ```

### 3. Setup the Database Schema

Run the complete SQL schema and Row Level Security (RLS) policies found in [`supabase_schema.sql`](file:///d:/PERSONAL_PROJECT/nottoday/supabase_schema.sql) directly inside your **Supabase SQL Editor**:
* It creates the `habits`, `streaks`, and `checkins` tables.
* It sets up strict RLS policies to ensure users can only view and edit their own data.

### 4. Run the Dev Server

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build

To verify compilation and create an optimized production build:
```bash
npm run build
npm run start
```

---

## 🌍 Deployment (Vercel)

1. Push your code to a Git repository (GitHub/GitLab).
2. Import the project in Vercel.
3. Configure the environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in your Vercel project settings.
4. **CRITICAL**: Add your production Vercel URL (e.g. `https://your-app.vercel.app/auth/callback`) as an allowed redirect URL in **Supabase Dashboard -> Authentication -> URL Configuration -> Redirect URLs**.

---

## 📜 License

This project is licensed under the MIT License.
