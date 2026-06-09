# MedEx Frontend — Design System Rules

## Project Overview

MedEx is a React + TypeScript + Vite medical platform with two surfaces:
- **Web** (desktop) — doctor-facing UI: sidebar, agenda, patient consultation form, search bar
- **Mobile** — patient-facing UI: bottom nav, multiple screens per feature area

**Figma file:** `PL4sxuPdmLdcAZOuKMwYnI` — file key to use in all MCP tool calls.

---

## Screen Inventory (from Figma)

### Mobile — Patient App (390px wide)

| Frame | Node ID | Description |
|---|---|---|
| Inicio | `1:1816` | Home — obra social card, guardias cercanas con mapa |
| Cuidados | `1:1328` | Medications — smart reminders, treatment tracking, inventory, pharmacy map |
| Boton: Historial | `1:1927` | Full history — timeline, charts (glucose/blood pressure/cholesterol), studies grid |
| Linea de tiempo: ver mas | `57:288` | Timeline expanded view |
| Historial de estudios: ver mas | `90:1281` | Studies grid — list view and compact view with filters |
| Boton: Perfil | `19:1299` | Profile — blood type, allergies, conditions, historial medico button |
| Familia | `19:661` | Family — multi-profile selector, member cards with alerts |
| Configuracion | `19:1530` | Settings — dark mode variant also available (`54:1100`) |
| Boton Header: Chatbot | `291:1071` | AI chatbot screen |
| Notificaciones | `147:140` | Notifications list |
| Registro | `1:1697` | Registration form |
| Inicio Sesion | `291:1013` | Login — profile picker |

**Modals/overlays:** Modal Notificaciones (`113:3531`), Modal QR Emergencias (`315:1168`), Modal Compartir (`119:166`), The Modal Card (document upload `94:860`)

### Web — Doctor App (1610px wide)

| Frame | Node ID | Description |
|---|---|---|
| Inicio Web | `392:1103` | Dashboard — quick access bento grid (Ver Agenda / Buscar Paciente / Nueva Consulta) |
| Web boton Agenda | `392:1346` | Agenda — daily schedule list with appointment rows |
| Web agenda persona | `388:445` | Consultation view — sidebar + patient card + consultation form |
| Web Agregar una consulta | `394:1613` | New appointment — patient picker, date/time, time slots |
| Web Ver Reporte Semanal | `395:1933` | Weekly report — KPIs, charts, consultation reasons, alerts |
| Inicio de Sesion web | `390:811` | Web login page |

---

## Navigation Structure

### Mobile Bottom Navigation (5 tabs)
1. **Inicio** — home with obra social and nearby hospitals
2. **Familia** — family members management
3. **Cuidados** — medications, treatments, pharmacy
4. **Historial** — medical history, studies, timeline
5. **Perfil** — user profile and settings

### Web Sidebar Navigation
- Agenda
- Registro de Pacientes
- Notificaciones
- Configuración
- Doctor profile + Chatbot + Cerrar Sesión (bottom)

---

## Component Organization

- Web components → `src/components/web/<componentName>/index.tsx`
- Mobile components → `src/components/mobile/<componentName>/index.tsx`
- Each component lives in its own folder with its CSS file: `<componentName>.css`
- Page-level files live directly in `src/`: `doctorHome.tsx`, `patientHome.tsx`, `HomePage.tsx`
- Types live in `src/types/` as individual `.ts` files

Before creating a new component, always check `src/components/web/` and `src/components/mobile/` for existing ones.

---

## Design System — Visual Language (from Figma)

### Color Palette
The Figma design uses a **teal/green primary palette** (medical, clean), not the purple currently in index.css. When implementing screens from Figma, match these values:

| Token | Value | Usage |
|---|---|---|
| Primary 1 | `#1F6F6B` | Primary actions, active states |
| Primary 2 | `#5FAFA9` | Secondary/hover states |
| Secondary 1 | `#D4ECEB` | Backgrounds, subtle fills |
| Secondary 2 | `#0B3131` | Dark text on light |
| Black | `#00201F` | Primary text |
| Gray 1 | `#416464` | Muted text |
| Gray 3 | `#BCC9C6` | Borders, dividers |
| Gray 6 | `#D9E5E2` | Card backgrounds |
| Gray 7 | `#F3F6F3` | Page backgrounds |
| White | `#FFFFFF` | Card surfaces |

### Design Tokens (CSS Variables in index.css)
The current CSS variables use purple (`--accent: #aa3bff`). When implementing Figma screens, map the Figma teal colors to these variables OR use the Figma hex values directly for new components until a full token migration is done.

Dark mode is defined under `@media (prefers-color-scheme: dark)` in `src/index.css`.

### Typography (from Figma UI Kit)
- Font: **Inter** (matches system-ui stack in index.css)
- Headings: weight 500, sizes H1=40px, H2=32-36px, H3=28px, H4=24-28px
- Body: 18px (desktop), 16px (mobile)
- Labels/captions: 15-16px

### Layout Patterns
- Mobile screens: 390px wide, 24px horizontal padding, content at 342px
- Cards: 16-24px padding, border-radius ~12px, subtle box-shadow
- Bento grid layout used extensively (asymmetric card grids)
- Bottom nav: 82px height, 5 tabs
- Mobile header (TopAppBar): 98px height

### Button Styles (from Figma)
- Primary: filled teal background, white text, 56px height, full-width or auto
- Secondary: outlined/ghost, same height
- Small: 36-40px height
- Border-radius: consistent ~8-12px across all buttons

---

## Styling Rules

- Use **plain CSS** with class names — no Tailwind, no CSS-in-JS, no styled-components
- Each component has a co-located CSS file imported as `import './componentName.css'`
- CSS class names use **kebab-case** (e.g. `mobile-header`, `card-estudio`)
- IMPORTANT: Never use inline `style={{ }}` for anything other than quick prototyping
- Spacing: use multiples of 4px / 8px as base units
- Typography: use `var(--sans)` for body, `var(--heading)` for headings, `var(--mono)` for code

---

## Naming Conventions

- Component functions: **PascalCase** (e.g. `MobileHeader`, `CardEstudio`)
- Component files: `index.tsx` inside a named folder
- CSS files: camelCase matching the folder name (e.g. `mobileHeader.css`, `cardEstudio.css`)
- Type files: camelCase lowercase (e.g. `paciente.ts`, `medico.ts`, `estudio.ts`)
- Props interface: inline type or `type Props = { ... }` — no separate interface files needed for small components

---

## TypeScript Types

All domain types are in `src/types/`:

- `paciente.ts` — extends `usuario`, adds dni, edad, identidadGenero, telefono, fotoPerfil
- `medico.ts` — extends `usuario`, adds usuarioId, organizacionId, matricula, especialidad, fotoPerfil
- `estudio.ts` — fotos[], tipoEstudio, fecha, institucion, informe?, medico?
- `consulta.ts`, `corte.ts` — additional domain types
- `Usuario.ts` — base user type

Always import types with `import type { ... }` (not `import { ... }`).

---

## Icons

- Use **@heroicons/react** for icons (already installed)
- Import from `@heroicons/react/16/solid` or `@heroicons/react/24/solid`
- For inline SVG icons used directly in JSX, use heroicons when possible instead of writing raw SVG
- IMPORTANT: Do NOT install new icon libraries

---

## Routing

- Uses `react-router-dom` v7
- Routes defined in `src/App.tsx`
- Navigation inside components: use `useNavigate()` hook

---

## Figma MCP Integration Rules

These rules define how to translate Figma inputs into code for this project.

### Required Flow (do not skip)

1. Run `get_design_context` to fetch the structured representation of the node
2. If response is too large, run `get_metadata` first to get the node map, then re-fetch specific nodes
3. Run `get_screenshot` for a visual reference of the exact variant being implemented
4. Only after having both `get_design_context` and `get_screenshot`, start implementation
5. Translate the Figma output into MedEx conventions (plain CSS, CSS variables, heroicons, existing types)
6. Validate against the Figma screenshot for 1:1 visual parity before marking complete

### Figma → Code Mapping

- Figma colors → CSS variables from `src/index.css` (match by value, pick closest token)
- Figma typography → use `var(--sans)`, `var(--heading)`, or `var(--mono)` + size in px
- Figma spacing → round to nearest 4px multiple
- Figma icons → use `@heroicons/react` equivalent when possible
- Figma components → check if component already exists in `src/components/` before creating new
- New web component → `src/components/web/<name>/index.tsx` + `<name>.css`
- New mobile component → `src/components/mobile/<name>/index.tsx` + `<name>.css`

### Asset Handling

- IMPORTANT: If the Figma MCP server returns a `localhost` URL for an image or SVG, use it directly as the `src`
- IMPORTANT: Do NOT create placeholder images or import new asset packages
- Static assets (logos, images) go in `public/`
- SVG assets used in code go in `src/assets/`

---

## Surface Separation

- **Web (doctor)** components are under `src/components/web/` — desktop layout, sidebar navigation
- **Mobile (patient)** components are under `src/components/mobile/` — mobile-first, header nav, card-based UI
- When implementing a Figma design, determine which surface it belongs to before placing the file
