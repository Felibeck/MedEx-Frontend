# CLAUDE.md — MedEx Frontend

Este archivo le da contexto a Claude Code cada vez que trabaja en este repositorio.
Se carga automáticamente al iniciar una sesión acá. Mantenerlo actualizado a medida
que el proyecto cambia.

Este archivo combina dos cosas: **arquitectura/stack de código** y **design system
(Figma)**. Antes vivían en documentos separados; se unificaron acá porque Claude
Code solo lee un `CLAUDE.md` por carpeta.

---

# PARTE 1 — Proyecto, stack y arquitectura de código

## Qué es MedEx Frontend

Interfaz web y mobile de MedEx, plataforma de gestión de citas/consultas médicas
que conecta Pacientes y Doctores. Tiene dos superficies dentro de la misma app:

- **Mobile** (mobile-first) — vista Paciente: historial de estudios, detalle con
  visor DICOM, perfil, familia, cuidados, etc.
- **Web** (desktop) — vista Doctor/Médico: agenda, panel de consulta, búsqueda de
  paciente por DNI, reporte semanal.

Consume la API REST del repo backend (`http://localhost:3000/api` en desarrollo).

## Stack

- **React 19** + TypeScript (~6.0.2)
- **Vite 8** (bundler y dev server)
- **react-router-dom v7** para navegación
- **Axios** (^1.18) como cliente HTTP, instancia centralizada en `src/api/client.ts`
- **@heroicons/react** (^2.2) para iconos — no instalar otras librerías de íconos
- **ESLint 10** para lint
- CSS plano colocado junto a cada componente — no Tailwind, no CSS-in-JS, no
  styled-components

## Estructura real de carpetas

```
src/
├── api/                     # Clientes y helpers de la API REST
│   ├── client.ts            # Instancia base de Axios + interceptor de auth
│   ├── patientAuth.ts       # Login/registro de paciente (ver patrón de mappers)
│   └── estudios.ts          # Fetch y mapeo de estudios del paciente
│
├── assets/                  # SVGs usados en código (imports)
│
├── components/
│   ├── mobile/               # Vista Paciente (mobile-first)
│   │   ├── cardEstudio/
│   │   ├── carruselFotos/
│   │   ├── detalleEstudio/
│   │   ├── historialEstudios/
│   │   ├── listaEstudios/
│   │   └── mobileHeader/
│   └── web/                  # Vista Médico (desktop)
│       ├── agenda/
│       ├── consulta/
│       ├── sidebar/
│       ├── searchBar/
│       └── registroConsulta/
│
├── config/
│   ├── constants.ts          # Constantes globales (ej: PACIENTE_ID por defecto)
│   └── tiposEstudio.ts       # Enum y labels de tipos de estudio + filtros
│
├── data/
│   └── mockEstudios.ts       # Datos mock para desarrollo local
│
├── pages/
│   └── mobile/
│       ├── PatientLogin.tsx
│       └── DetalleEstudioPage.tsx
│
├── types/                    # Tipos TS compartidos (DTOs y props)
│   ├── estudio.ts
│   ├── medico.ts
│   ├── paciente.ts
│   ├── turno.ts
│   ├── consulta.ts
│   ├── corte.ts
│   └── Usuario.ts
│
├── App.tsx                   # Definición de rutas
├── HomePage.tsx               # Selección de vista (Paciente / Doctor)
├── patientHome.tsx
├── doctorHome.tsx
├── index.css                 # Variables CSS globales, reset base
└── main.tsx                  # Bootstrap, monta BrowserRouter
```

Component Organization (regla de oro):
- Web → `src/components/web/<componentName>/index.tsx` + `<componentName>.css`
- Mobile → `src/components/mobile/<componentName>/index.tsx` + `<componentName>.css`
- Páginas de nivel superior van directo en `src/` (`doctorHome.tsx`, etc.)
- **Antes de crear un componente nuevo, revisar si ya existe uno similar** en
  `src/components/web/` o `src/components/mobile/`.

## Rutas actuales

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | `HomePage` | Selección de vista (Paciente / Doctor) |
| `/patients` | `PatientHome` | Historial de estudios del paciente |
| `/patients/estudio/:id` | `DetalleEstudioPage` | Detalle de estudio con visor DICOM |
| `/doctor` | `DoctorHome` | Dashboard del médico: agenda y consulta |

Rutas nuevas se agregan en `App.tsx`. Navegación interna con el hook `useNavigate()`.

## Patrón de API y mappers (importante)

Los archivos en `src/api/` no exponen los shapes crudos del backend directamente.
Siguen este patrón (ver `src/api/patientAuth.ts` como referencia):

1. Tipos `ApiXxx` que reflejan exactamente lo que devuelve el backend (snake_case,
   ej: `es_medico`, `fecha_nacimiento`).
2. Interfaces internas en camelCase (ej: `UserSession` con `esMedico`) que son las
   que consume el resto de la app.
3. Una función `mapXxxFromApi()` que traduce de una a otra.
4. La función exportada (ej: `loginPatient`) hace la llamada con `api` (instancia de
   Axios), valida `success` en la respuesta, y devuelve el tipo mapeado — nunca el
   crudo del backend.

Al integrar un endpoint nuevo, seguir este mismo patrón de 3 capas (tipo API →
mapper → tipo interno), no consumir la respuesta cruda directo en el componente.

## Autenticación

- El token JWT se guarda en `localStorage` bajo la key `token` (más `medex_user_id`
  y `medex_user` para la sesión del paciente — ver `PatientLogin.tsx`).
- `src/api/client.ts` tiene un interceptor de request que inyecta automáticamente
  `Authorization: Bearer <token>` en cada llamada si el token existe. No repetir esa
  lógica manualmente en cada llamada a la API.

## Convención de respuesta esperada del backend

El backend responde siempre con el envelope `{ success, message?, data? }`. Los
mappers en `src/api/` deben validar `data.success` antes de usar `data.data`, y
lanzar `Error(data.message)` en caso de `success: false`.

## TypeScript

Todos los tipos de dominio están en `src/types/`:

- `paciente.ts` — extiende `Usuario`, agrega `dni`, `edad`, `identidadGenero`,
  `telefono`, `fotoPerfil`
- `medico.ts` — extiende `Usuario`, agrega `usuarioId`, `organizacionId`,
  `matricula`, `especialidad`, `fotoPerfil`
- `estudio.ts` — `fotos[]`, `tipoEstudio`, `fecha`, `institucion`, `informe?`, `medico?`
- `consulta.ts`, `corte.ts` — tipos de dominio adicionales
- `Usuario.ts` — tipo base de usuario

Siempre importar tipos con `import type { ... }` (no `import { ... }`).

## Tipos de estudio soportados

| Código | Label |
|--------|-------|
| `MAMOGRAFIA` | Mamografía |
| `ECOGRAFIA` | Ecografía |
| `LABORATORIO` | Laboratorio |
| `RESONANCIA` | Resonancia |
| `BIOPSIA` | Biopsia |

Definidos en `src/config/tiposEstudio.ts`. Si el backend introduce un tipo de
estudio nuevo (vía la tabla catálogo `tipos_estudio`), reflejarlo acá también.

## Trabajo pendiente conocido

Integración frontend para dos campos ya implementados en el backend (`consultas`):
- `tipo_consulta` — string, uno de: `primera_vez`, `seguimiento`, `control`,
  `urgencia`, `telemedicina` (ENUM en el backend)
- `tipo_estudio_id` — FK nullable, requerida condicionalmente cuando
  `solicitud_estudio` es true; el backend resuelve el nombre legible vía join

Esto afecta principalmente `src/types/consulta.ts` y el formulario en
`src/components/web/registroConsulta/`.

## Configuración / variables de entorno

La URL base de la API está **hardcodeada** en `src/api/client.ts`
(`http://localhost:3000/api`), no usa variable de entorno todavía. Si se necesita
apuntar a otro entorno, migrar a `VITE_API_URL` en vez de hardcodear un segundo
valor en otro lugar.

## Comandos

- Instalar dependencias: `npm install`
- Dev: `npm run dev` (Vite)
- Build: `npm run build` (corre `tsc -b` antes de `vite build` — resolver errores de
  TypeScript antes de que el build pueda completar)
- Preview del build: `npm run preview`
- Lint: `npm run lint` (ESLint, configuración en `eslint.config.js`)
- Test: no hay tests configurados en el repo actualmente

## Notas del repo

- El repo tiene `express` en `package.json` pero **no hay código de servidor acá**
  — no asumir ni modificar comportamiento de backend desde este repo.
- No agregar un framework de testing sin aprobación explícita.

## Fuera de alcance para este repo

Migraciones, lógica de negocio del backend, acceso a Supabase, y cualquier cambio
de la API en sí van en el repo backend, no acá. Backend y frontend se tratan como
tareas secuenciales y desacopladas.

---

# PARTE 2 — Design System (Figma)

**Figma file:** `PL4sxuPdmLdcAZOuKMwYnI` — file key a usar en todas las llamadas MCP.

## Inventario de pantallas (Figma)

### Mobile — App Paciente (390px de ancho)

| Frame | Node ID | Descripción |
|---|---|---|
| Inicio | `1:1816` | Home — card de obra social, guardias cercanas con mapa |
| Cuidados | `1:1328` | Medicación — recordatorios, seguimiento de tratamiento, inventario, farmacias |
| Boton: Historial | `1:1927` | Historial completo — timeline, gráficos (glucosa/presión/colesterol), grid de estudios |
| Linea de tiempo: ver mas | `57:288` | Vista expandida de timeline |
| Historial de estudios: ver mas | `90:1281` | Grid de estudios — vista lista y compacta con filtros |
| Boton: Perfil | `19:1299` | Perfil — grupo sanguíneo, alergias, condiciones, botón historial médico |
| Familia | `19:661` | Selector multi-perfil, tarjetas de miembros con alertas |
| Configuracion | `19:1530` | Ajustes — variante dark mode también disponible (`54:1100`) |
| Boton Header: Chatbot | `291:1071` | Pantalla de chatbot IA |
| Notificaciones | `147:140` | Lista de notificaciones |
| Registro | `1:1697` | Formulario de registro |
| Inicio Sesion | `291:1013` | Login — selector de perfil |

**Modals/overlays:** Modal Notificaciones (`113:3531`), Modal QR Emergencias
(`315:1168`), Modal Compartir (`119:166`), Modal Card / subida de documento (`94:860`)

### Web — App Médico (1610px de ancho)

| Frame | Node ID | Descripción |
|---|---|---|
| Inicio Web | `392:1103` | Dashboard — bento grid de accesos rápidos (Ver Agenda / Buscar Paciente / Nueva Consulta) |
| Web boton Agenda | `392:1346` | Agenda — lista diaria de turnos |
| Web agenda persona | `388:445` | Vista de consulta — sidebar + card de paciente + formulario |
| Web Agregar una consulta | `394:1613` | Nuevo turno — selector de paciente, fecha/hora, slots |
| Web Ver Reporte Semanal | `395:1933` | Reporte semanal — KPIs, gráficos, motivos de consulta, alertas |
| Inicio de Sesion web | `390:811` | Login web |

## Navegación

### Bottom nav mobile (5 tabs)
1. Inicio — home con obra social y hospitales cercanos
2. Familia — gestión de miembros de familia
3. Cuidados — medicación, tratamientos, farmacia
4. Historial — historial médico, estudios, timeline
5. Perfil — perfil de usuario y configuración

### Sidebar web
Agenda · Registro de Pacientes · Notificaciones · Configuración · (abajo: perfil del
doctor + Chatbot + Cerrar Sesión)

## Paleta de colores (Figma)

Paleta primaria **teal/verde** (estética médica, limpia) — distinta al morado que
hay actualmente en `index.css`. Al implementar pantallas desde Figma, usar estos
valores:

| Token | Valor | Uso |
|---|---|---|
| Primary 1 | `#1F6F6B` | Acciones primarias, estados activos |
| Primary 2 | `#5FAFA9` | Estados secundarios/hover |
| Secondary 1 | `#D4ECEB` | Fondos, rellenos sutiles |
| Secondary 2 | `#0B3131` | Texto oscuro sobre fondo claro |
| Black | `#00201F` | Texto principal |
| Gray 1 | `#416464` | Texto atenuado |
| Gray 3 | `#BCC9C6` | Bordes, separadores |
| Gray 6 | `#D9E5E2` | Fondos de card |
| Gray 7 | `#F3F6F3` | Fondos de página |
| White | `#FFFFFF` | Superficies de card |

### Design tokens (variables CSS en `index.css`)

Las variables actuales usan morado (`--accent: #aa3bff`). Al implementar pantallas
de Figma: mapear los colores teal de Figma a estas variables, **o** usar los valores
hex de Figma directamente en componentes nuevos hasta que se haga una migración
completa de tokens.

Dark mode está definido bajo `@media (prefers-color-scheme: dark)` en `src/index.css`.

## Tipografía (Figma UI Kit)

- Fuente: **Inter** (coincide con el stack `system-ui` de `index.css`)
- Headings: peso 500, tamaños H1=40px, H2=32-36px, H3=28px, H4=24-28px
- Body: 18px (desktop), 16px (mobile)
- Labels/captions: 15-16px

## Patrones de layout

- Pantallas mobile: 390px de ancho, 24px de padding horizontal, contenido a 342px
- Cards: 16-24px de padding, border-radius ~12px, box-shadow sutil
- Bento grid usado extensivamente (grillas de cards asimétricas)
- Bottom nav: 82px de alto, 5 tabs
- Header mobile (TopAppBar): 98px de alto

## Estilos de botones (Figma)

- Primary: fondo teal sólido, texto blanco, 56px de alto, full-width o auto
- Secondary: outlined/ghost, mismo alto
- Small: 36-40px de alto
- Border-radius: ~8-12px consistente en todos los botones

## Reglas de estilo (CSS)

- CSS plano con nombres de clase — nada de Tailwind, CSS-in-JS ni styled-components
- Cada componente tiene un CSS co-ubicado, importado como `import './componentName.css'`
- Clases CSS en **kebab-case** (ej: `mobile-header`, `card-estudio`)
- **Nunca** usar `style={{ }}` inline salvo prototipado rápido
- Espaciado: múltiplos de 4px / 8px como unidad base
- Tipografía: `var(--sans)` para body, `var(--heading)` para headings, `var(--mono)`
  para código

## Convenciones de nombres

- Funciones de componente: **PascalCase** (ej: `MobileHeader`, `CardEstudio`)
- Archivos de componente: `index.tsx` dentro de una carpeta con nombre propio
- Archivos CSS: camelCase igual al nombre de la carpeta (ej: `mobileHeader.css`)
- Archivos de tipos: camelCase en minúscula (ej: `paciente.ts`, `medico.ts`)
- Props: tipo inline o `type Props = { ... }` — no hace falta un archivo de
  interfaz separado para componentes chicos

## Iconos

- Usar **@heroicons/react** (ya instalado)
- Importar desde `@heroicons/react/16/solid` o `@heroicons/react/24/solid`
- Para SVG inline en JSX, preferir heroicons antes que escribir SVG crudo
- **No instalar librerías de íconos nuevas**

## Integración Figma MCP — flujo obligatorio

Al traducir un diseño de Figma a código, no saltear pasos:

1. Correr `get_design_context` para obtener la representación estructurada del nodo
2. Si la respuesta es muy grande, correr primero `get_metadata` para el mapa de
   nodos, y volver a pedir nodos específicos
3. Correr `get_screenshot` como referencia visual de la variante exacta a implementar
4. Solo después de tener `get_design_context` y `get_screenshot`, empezar a implementar
5. Traducir el output de Figma a las convenciones de MedEx (CSS plano, variables
   CSS, heroicons, tipos existentes)
6. Validar contra el screenshot de Figma para paridad visual 1:1 antes de dar
   por terminado

### Mapeo Figma → Código

- Colores de Figma → variables CSS de `src/index.css` (mapear por valor, elegir el
  token más cercano)
- Tipografía de Figma → usar `var(--sans)`, `var(--heading)` o `var(--mono)` + tamaño en px
- Espaciado de Figma → redondear al múltiplo de 4px más cercano
- Íconos de Figma → equivalente en `@heroicons/react` cuando sea posible
- Componentes de Figma → revisar si ya existe algo similar en `src/components/`
  antes de crear uno nuevo
- Componente web nuevo → `src/components/web/<name>/index.tsx` + `<name>.css`
- Componente mobile nuevo → `src/components/mobile/<name>/index.tsx` + `<name>.css`

### Manejo de assets

- Si el servidor MCP de Figma devuelve una URL `localhost` para una imagen o SVG,
  usarla directamente como `src`
- **No** crear imágenes placeholder ni importar paquetes de assets nuevos
- Assets estáticos (logos, imágenes) van en `public/`
- SVGs usados en código van en `src/assets/`

## Separación de superficies

- Componentes **web** (doctor) van en `src/components/web/` — layout desktop,
  navegación por sidebar
- Componentes **mobile** (paciente) van en `src/components/mobile/` — mobile-first,
  navegación por header, UI basada en cards
- Al implementar un diseño de Figma, determinar primero a qué superficie
  pertenece antes de decidir dónde va el archivo