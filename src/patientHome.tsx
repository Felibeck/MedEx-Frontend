import MobileHeader from './components/mobile/mobileHeader'
import ListaEstudios from './components/mobile/listaEstudios'
import type { estudio } from './types/estudio'

const mockEstudios: estudio[] = [
  {
    fotos: ['/medex-logo.png'],
    tipoEstudio: 'Radiografía de tórax',
    fecha: new Date('2024-05-20'),
    institucion: 'Hospital Central',
    informe: 'Informe de ejemplo 1',
  },
  {
    fotos: ['/medex-logo.png'],
    tipoEstudio: 'Tomografía computada',
    fecha: new Date('2023-11-10'),
    institucion: 'Clínica San José',
    informe: 'Informe de ejemplo 2',
  },
]

const PatientHome = () => {
  return (
    <div style={{
      maxWidth: 390,
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#f3f6f3',
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'left',
    }}>
      <MobileHeader />
      <main style={{ padding: '16px 20px 20px' }}>
        <ListaEstudios estudios={mockEstudios} />
      </main>
    </div>
  )
}

export default PatientHome
