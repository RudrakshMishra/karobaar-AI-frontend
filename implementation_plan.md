# Implementation Plan: Massive "Cryptolink" Theme & Advanced UX Overhaul

Your new directive requires an enormous leap in both visual fidelity and functional complexity. Based on the 3 reference images provided and the 50+ advanced UI/UX features requested, here is the structured plan to execute this vision.

## Open Questions

Before we proceed with writing thousands of lines of code, please clarify the following:
1. **Color Scheme Conflict:** The previous instruction specified Neon Lime Green (`#C6FF00`), but the new reference images clearly showcase a **Copper/Orange/Gold (`#FF6B00` / `#FFA500`)** aesthetic. I will assume the *images take priority* and we should pivot to the Gold/Orange crypto aesthetic. Is this correct?
2. **Backend Scope:** You asked to "integrate full backend functionalities." Since we have `@supabase/supabase-js` installed, I will wire up an actual PostgreSQL database on Supabase for Auth (replacing the JWT mock), real Database inserts for the CSV, and Supabase Realtime for the "Real-time collaboration cursor". Is this acceptable?
3. **Database Setup:** You will need to click the UI on your Supabase dashboard to run the SQL schemas I provide, as I cannot do that automatically on an external platform without your keys.

## Proposed Changes

We will execute this colossal update in **5 distinct phases**.

### Phase 1: Visual Theme Pivot & Core Layout Update
We transition from Lime Green to the "Cryptolink" Gold/Orange look shown in the images.
#### [MODIFY] `src/app/globals.css` & `tailwind.config.ts`
- Replace `--lime` with `--accent-gold: #FF7300;` and `--accent-glow: rgba(255,115,0,0.3)`.
- Recreate the deep black, glowing gold aesthetic for cards and lines.
#### [MODIFY] `src/app/layout.tsx`
- Implement **View Transitions API** wrapper for the "Curtain wipe transition" and "Crossfade with scale".
- Add a top-level Framer Motion `AnimatePresence` to support page unmounting logic.

### Phase 2: Landing Page Overhaul (Images 1 & 3)
Matching the uploaded screenshots and "Advanced Page Transitions / Media" requirements.
#### [MODIFY] `src/app/page.tsx`
- **Hero:** Incorporate a 3D CSS / Three.js rotating "Golden Cube" based on Image 1.
- **Scroll Storytelling:** Implement `useScroll` and `useTransform` from Framer Motion to tie text reveals and 3D cube rotations to user scroll position.
- **Scrollytelling Scenes:** Create the "Setting a New Standard" section (Image 3) with 3D perspective tilt cards (`react-tilt` wrapped over glassmorphism panes).
- **Infinite Logo Ticker:** Fade rows of crypto logos sliding infinitely in the background behind the cube.

### Phase 3: Dashboard Redesign (Image 2) & SaaS Patterns
#### [MODIFY] `src/app/dashboard/page.tsx` & `layout.tsx`
- Rebuild the layout to match the "Cryptolink" sidebar exactly.
- **Charts:** Update the 30-day Revenue chart to the multi-line orange squiggle from Image 2. Add the "Market Dynamics" Bar Chart with hover-state opacity.
- **Command Bar:** Implement `cmdk` (⌘K) to fuzzy search between Dashboard, Trading, Analytics, and Markets.
- **Data Tables:** Implement floating headers, expandable rows, and swipe-to-archive (using Framer Motion `drag` attributes).

### Phase 4: Full Backend Functionality (Auth & DB)
Swapping mocks for genuine integration.
#### [MODIFY] `src/lib/supabase.ts`
- Finalize Supabase client for DB, Realtime, and Auth access.
#### [MODIFY] `src/app/api/auth/...`, `/api/dashboard`, `/api/upload`
- Connect our Next.js API generic endpoints to perform actual SQL inserts using Supabase via the client.
- Create standard Data Definition Language (DDL) artifacts so you can create the `users`, `products`, and `sales` tables.
#### [NEW] Real-time Cursors component
- Hook into Supabase Realtime Presence to track the mouse `x` and `y` coordinates of other simulated/real users viewing the dashboard.

### Phase 5: The "Kitchen Sink" Micro-interactions
Implementing the highly specific, complex, and experimental UX behaviors requested.
- **Haptic Feedback:** `navigator.vibrate([50])` bound to button clicks.
- **Chromatic Aberration Hover:** A custom CSS filter that offsets RGB channels on `onMouseMove`.
- **Passkey/WebAuthn:** Inject `@simplewebauthn/browser` logic into the SignIn component if biologically requested.
- **Paint Worklet (Houdini):** Use `CSS.paintWorklet` for a highly custom background mesh if standard canvas becomes too slow.

---

## Verification Plan
1. **Theming Check:** Ensure all Lime green is eradicated and replaced with the targeted Gold/Orange gradients.
2. **Scroll Validation:** Check `page.tsx` manually to ensure the 3D cube shrinks and text curates as `scrollY` increases.
3. **Backend Binding:** Attempting an Auth Sign-Up should accurately reflect inside the Supabase network tab, establishing real persisted dashboard data mapping.
