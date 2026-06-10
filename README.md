# MedEx — Frontend

Interfaz web y mobile para la plataforma de salud **MedEx**, construida con React + TypeScript + Vite.

---

## Tecnologías

- **React 18** + **TypeScript**
- **Vite** — bundler y dev server
- **React Router v6** — navegación entre vistas
- **Axios** — cliente HTTP
- **CSS Modules / CSS plain** — estilos por componente

---

## Estructura del proyecto

```
src/
├── api/                    # Clientes y helpers de la API REST
│   ├── client.ts           # Instancia base de Axios
│   └── estudios.ts         # Fetch y mapeo de estudios del paciente
│
├── components/
│   ├── mobile/             # Componentes de la vista paciente (mobile-first)
│   │   ├── cardEstudio/        # Tarjeta de resumen de un estudio
│   │   ├── carruselFotos/      # Carrusel DICOM con miniaturas
│   │   ├── detalleEstudio/     # Página de detalle de un estudio
│   │   ├── historialEstudios/  # Lista completa con filtros por tipo
│   │   ├── listaEstudios/      # Renderiza la colección de cards
│   │   └── mobileHeader/       # Header con logo, chatbot y notificaciones
│   │
│   └── web/                # Componentes de la vista médico (desktop)
│       ├── agenda/             # Agenda del día con lista de turnos
│       ├── consulta/           # Panel principal de atención al paciente
│       ├── sidebar/            # Navegación lateral del médico
│       ├── searchBar/          # Búsqueda de paciente por DNI
│       └── registroConsulta/   # Formulario de registro de consulta
│
├── config/
│   ├── constants.ts        # Constantes globales (ej: PACIENTE_ID)
│   └── tiposEstudio.ts     # Enum y labels de tipos de estudio + filtros
│
├── data/
│   └── mockEstudios.ts     # Datos de ejemplo para desarrollo local
│
├── pages/
│   └── mobile/
│       └── DetalleEstudioPage.tsx  # Page wrapper para /patients/estudio/:id
│
├── types/                  # Tipos TypeScript compartidos
│   ├── estudio.ts
│   ├── medico.ts
│   ├── paciente.ts
│   ├── turno.ts
│   ├── consulta.ts
│   ├── corte.ts
│   └── Usuario.ts
│
├── App.tsx                 # Definición de rutas
├── HomePage.tsx            # Pantalla de inicio con selección de vista
├── patientHome.tsx         # Entrada a la vista paciente
├── doctorHome.tsx          # Entrada a la vista médico
└── main.tsx                # Bootstrap de la app
```

---

## Rutas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | `HomePage` | Selección de vista (Paciente / Doctor) |
| `/patients` | `PatientHome` | Historial de estudios del paciente |
| `/patients/estudio/:id` | `DetalleEstudioPage` | Detalle de un estudio con visor DICOM |
| `/doctor` | `DoctorHome` | Dashboard del médico con agenda y consulta |

---

## Instalación y desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build de producción
npm run build
```

> El frontend consume la API REST en `http://localhost:3000/api`. Asegurate de tener el backend corriendo antes de usar las rutas que requieren datos reales.

---

## Vistas

### Vista Paciente (`/patients`)

Interfaz mobile-first para que el paciente consulte su historial de estudios médicos.

- Listado de estudios con filtros por tipo (Mamografía, Ecografía, Laboratorio, Resonancia, Biopsia)
- Tarjetas con imagen/thumbnail, fecha e institución
- Detalle de estudio con visor de cortes DICOM, informe médico y datos del profesional firmante
- Botones para descargar PDF y compartir con médico

### Vista Médico (`/doctor`)

Dashboard desktop para la gestión de consultas médicas.

- Sidebar de navegación con agenda, pacientes, notificaciones y configuración
- Agenda del día con lista de turnos y paciente activo
- Panel de consulta con datos del paciente, antecedentes y formulario de registro
- Búsqueda de pacientes por DNI

---

## Tipos de estudio soportados

| Código | Label |
|--------|-------|
| `MAMOGRAFIA` | Mamografía |
| `ECOGRAFIA` | Ecografía |
| `LABORATORIO` | Laboratorio |
| `RESONANCIA` | Resonancia |
| `BIOPSIA` | Biopsia |

---

## Variables de entorno / Configuración

Por ahora la URL base de la API está hardcodeada en `src/api/client.ts`:

```ts
baseURL: 'http://localhost:3000/api'
```

Para cambiarla, modificar ese archivo o migrar a una variable de entorno Vite (`VITE_API_URL`).

---

## Datos de prueba

El archivo `src/data/mockEstudios.ts` contiene estudios de ejemplo con imágenes públicas de Wikimedia. Se usan en la página de detalle cuando el id no coincide con datos reales del backend.

El `PACIENTE_ID` por defecto está definido en `src/config/constants.ts`.