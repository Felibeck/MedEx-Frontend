import type { estudio } from '../types/estudio'

const IMAGEN_RX =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Chest_X-ray_in_influenza_and_Haemophilus_influenzae.jpg/800px-Chest_X-ray_in_influenza_and_Haemophilus_influenzae.jpg'

export const MOCK_ESTUDIOS: estudio[] = [
  {
    id: 1,
    tipo: 'MAMOGRAFIA',
    tipoEstudio: 'Mamografía',
    categoria: 'Mamografía',
    fecha: new Date('2024-10-03'),
    institucion: 'Hospital Italiano de Bs As',
    fotos: [IMAGEN_RX],
    cortes: [
      { id: 'c1', label: 'C1', imagen: IMAGEN_RX },
      { id: 'c2', label: 'C2', imagen: IMAGEN_RX },
      { id: 'c3', label: 'C3', imagen: IMAGEN_RX },
      { id: 'c4', label: 'C4', imagen: IMAGEN_RX },
    ],
    informe:
      'Hallazgos: Se observa una rectificación de la lordosis fisiológica. Discos intervertebrales con signos de deshidratación en niveles L4-L5 y L5-S1.\n\nNivel L4-L5: Pequeña protrusión discal posterior de base ancha con leve impronta sobre el saco tecal.\n\nNivel L5-S1: Hernia discal paracentral derecha que contacta la raíz S1 homolateral en su trayecto descendente.\n\nConclusión: Signos de discopatía degenerativa en los últimos dos niveles lumbares con compromiso radicular derecho.',
    medico: {
      usuarioId: 'med-001',
      id: 1,
      nombre: 'Dr. Arrieta',
      apellido: '',
      email: 'arrieta@hospital.com',
      password: '',
      esMedico: true,
      organizacionId: 'org-001',
      matricula: '12345',
      especialidad: 'Especialista en Diagnóstico por Imágenes',
      fotoPerfil: '',
    },
    pacienteId: '#MED-982-S',
    pacienteDob: '14/05/1978',
    metadataDicom: 'TE: 12.8ms | TR: 450ms | Series: AX T2 W',
  },
  {
    id: 2,
    tipo: 'RESONANCIA',
    tipoEstudio: 'Resonancia',
    categoria: 'Resonancia',
    fecha: new Date('2024-05-12'),
    institucion: 'Hospital Italiano',
    fotos: [IMAGEN_RX],
    cortes: [
      { id: 'c1', label: 'C1', imagen: IMAGEN_RX },
      { id: 'c2', label: 'C2', imagen: IMAGEN_RX },
    ],
    informe:
      'Campos pulmonares sin opacidades. Silueta cardíaca de tamaño normal. Sin derrame pleural.',
    medico: {
      usuarioId: 'med-002',
      id: 2,
      nombre: 'Dra. López',
      apellido: '',
      email: 'lopez@hospital.com',
      password: '',
      esMedico: true,
      organizacionId: 'org-001',
      matricula: '67890',
      especialidad: 'Neumonología',
      fotoPerfil: '',
    },
    pacienteId: '#MED-541-R',
    pacienteDob: '22/03/1990',
    metadataDicom: 'TE: 8ms | TR: 200ms | Series: PA',
  },
]
