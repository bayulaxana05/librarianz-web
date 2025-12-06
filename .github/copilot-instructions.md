<!-- Copilot / AI Agent instructions for working on this repo -->
# Copilot Instructions

Purpose: provide concise, actionable guidance for AI coding agents working on this Next.js eCommerce template.

**Big Picture:**
- **Framework:** Next.js (App Router) + TypeScript. Main application code lives under `src/app` (see `src/app/(site)/layout.tsx`).
- **State:** Redux Toolkit is used for global state. Store is configured in `src/redux/store.ts` and provided at the root via `src/redux/provider.tsx`.
- **UI:** Components are organized by feature under `src/components/` with many folders exposing an `index.tsx` default export.
- **Styling:** Tailwind CSS + global CSS in `src/css/` (imported in the root layout). Fonts and static assets live under `public/images`.
- **Integrations:** Dependencies include `next-auth`, `next-sanity` and `nodemailer`—check for provider/config files if working on auth or CMS features.

**Key Files to Reference:**
- `src/app/(site)/layout.tsx` — root layout: wraps children with `ReduxProvider`, modal context providers, and imports global CSS.
- `src/redux/store.ts` & `src/redux/provider.tsx` — global store and typed selector usage.
- `src/context/*Context.tsx` — modal and preview contexts (QuickView, CartSidebar, PreviewSlider) demonstrating how modals are toggled.
- `src/components/Header/index.tsx` and `src/components/Footer/index.tsx` — examples of composable components reused across pages.
- `package.json` — scripts: `npm run dev`, `npm run build`, `npm start`, `npm run lint`.
- `tsconfig.json` — path alias `@/*` -> `src/*` (use `@/` imports in new files).

**Project-Specific Patterns & Conventions:**
- App Router: many files use `"use client"`. When adding client components or using hooks/DOM APIs, ensure you include `"use client"` at the top.
- Global providers are composed at the root layout. Add new providers there if they must wrap the whole app (follow provider ordering in `layout.tsx`).
- Redux slices live under `src/redux/features` and are imported by name in `store.ts`. When adding a slice, export its reducer and add to the root reducer object.
- Context modal pattern: use Context providers in `src/context` to manage modal open/close state and consumers in `components/Common/*Modal`.
- Component folder pattern: feature folders often contain an `index.tsx` (default export) and supporting files (e.g., `SingleItem.tsx`). Follow this pattern for new components.

**Workflows & Commands (how devs run things):**
- Development server: `npm run dev` (starts Next.js dev server).
- Build & production: `npm run build` then `npm start`.
- Lint: `npm run lint` (uses Next.js ESLint config).
- TypeScript: project is typed but not `strict: true` (see `tsconfig.json`).

**When Making Changes — Practical Rules for AI Agents:**
- Prefer small, focused PRs. Keep changes scoped to a feature folder unless touching global providers or config.
- Avoid moving files between server and client boundary without explicit `"use client"` changes — importing browser-only APIs into server components causes runtime errors.
- When adding stateful UI, choose between local context (in `src/context`) and Redux. Follow existing pattern: ephemeral UI (modals, previews) -> context; cross-app state (cart, wishlist, product details) -> Redux.
- Use `@/` imports for internal modules (e.g., `import { ReduxProvider } from '@/redux/provider'`).

**Quick Examples:**
- Add a new slice: create `src/redux/features/mySlice.ts`, export reducer, then add `mySlice: mySliceReducer` to `src/redux/store.ts`.
- Add client component: place under `src/components/MyFeature/`, include `"use client"` at the top if it uses hooks, and export default from `index.tsx`.

**What to Look For When Asked to Modify:**
- If task touches auth or CMS, search for `next-auth` and `sanity` usages — integration code may live elsewhere or be incomplete in this template.
- For styling issues, check `src/css/style.css` and `tailwind.config.ts` first; site-wide layout is controlled in `layout.tsx`.

**Do / Don't (short):**
- Do: keep provider order and Redux types consistent (`RootState`, `AppDispatch` exist in `store.ts`).
- Do: respect `use client` boundary. Use `@/` alias for imports.
- Don't: import DOM/APIs into server components; don't assume backend services are configured (e.g., Sanity/Nodemailer may require env vars).

If anything here is unclear or you need more examples (test commands, env var names, backend stubs), ask and I will refine this file.
