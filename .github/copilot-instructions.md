<!-- Copilot instructions for AI coding agents working on the MedEx-Frontend repo -->
# MedEx-Frontend — AI assistant guidance

This file gives focused, actionable guidance to become immediately productive in this Vite + React + TypeScript frontend.

- **Project type:** Vite + React + TypeScript single-app frontend. Entrypoint: `src/main.tsx` -> `src/App.tsx`.
- **Run locally:** use `npm run dev` (runs `vite`). Build with `npm run build` (runs `tsc -b && vite build`). Preview with `npm run preview`.
- **Lint:** `npm run lint` runs `eslint .` — follow existing ESLint setup in `eslint.config.js`.

- **High-level structure**
  - `src/components/mobile/*` — mobile-first UI components (patient screens, uploader, card, header).
  - `src/components/web/*` — web/desktop views (agenda, consulta, registroConsulta, searchBar, sidebar).
  - `src/types/*` — domain TypeScript types (e.g., `estudio.ts`, `medico.ts`) — use these for DTOs and props.
  - Styles are colocated: many components have a same-folder `.css` (e.g., `cardEstudio.css`, `mobileHeader.css`). Keep that pattern.

- **Routing & app bootstrap**
  - `src/main.tsx` mounts the app with `BrowserRouter`.
  - `src/App.tsx` uses `react-router-dom` `Routes`/`Route`. Add new routes inside `App.tsx` and create components under `src/components`.

- **Patterns and conventions to follow**
  - Prefer colocated `.css` files next to their component files; follow existing naming and import style.
  - Use the types in `src/types` for component props and API shapes when available.
  - Keep components small and split mobile vs web views under their respective directories.
  - Do not introduce a global CSS overhaul; prefer local styles unless adding a new shared token file.

- **Build & type-check details**
  - `npm run build` runs `tsc -b` before `vite build` — the repo uses TypeScript build mode; keep `tsconfig.app.json` and `tsconfig.node.json` in mind when adding type-aware ESLint rules.

- **Notable dependencies / integrations**
  - `react-router-dom` v7 for routing. Check route element shapes when updating navigation.
  - `@heroicons/react` used for icons in UI components.
  - `express` appears in `package.json` dependencies but there is no server code in this repo; do not assume or modify server-side behavior here without confirmation.

- **When editing code**
  - Run `npm run dev` to verify HMR; fix TypeScript errors reported by `tsc -b` during builds.
  - Run `npm run lint` before pushing changes.
  - Keep changes confined to the relevant component folder and update corresponding CSS files.

- **Examples**
  - Add a mobile-only component: create `src/components/mobile/newComp.tsx` + `newComp.css`, export it, and add a route in `src/App.tsx` for `/new-route`.
  - Reuse a type: import `{ Estudio }` from `src/types/estudio` for props and API responses.

- **What NOT to do**
  - Do not add or assume backend endpoints in this repo. There is no API client layer here to modify without extra context.
  - Avoid changing global build configs (`vite.config.ts`, root `tsconfig.*`) unless the change is minimal and requested.

If anything here is unclear or you want more detail (example PR template, preferred commit message format, or test harness), tell me which part to expand.
