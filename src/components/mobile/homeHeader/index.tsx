import './homeHeader.css'

interface HomeHeaderProps {
  nombre: string
  apellido: string
}

const HomeHeader = ({ nombre, apellido }: HomeHeaderProps) => {
  const nombreCompleto = `${nombre} ${apellido}`.trim()

  return (
    <div className="home-header">
      <p className="home-header__saludo">Te damos la bienvenida{nombreCompleto ? ',' : ''}</p>
      {nombreCompleto && <h1 className="home-header__name">{nombreCompleto}</h1>}
    </div>
  )
}

export default HomeHeader
