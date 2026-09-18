import './homeHeader.css'

interface HomeHeaderProps {
  nombre: string
  apellido: string
  fotoPerfil?: string
}

const HomeHeader = ({ nombre, apellido, fotoPerfil }: HomeHeaderProps) => {
  return (
    <div className="home-header">
      <div className="home-header__content">
        <div className="home-header__text">
          <h1 className="home-header__title">Bienvenido</h1>
          <p className="home-header__name">{nombre} {apellido}</p>
        </div>
        <div className="home-header__avatar">
          {fotoPerfil ? (
            <img 
              src={fotoPerfil} 
              alt={`${nombre} ${apellido}`}
              className="home-header__avatar-img"
            />
          ) : (
            <div className="home-header__avatar-placeholder">
              {nombre.charAt(0)}{apellido.charAt(0)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomeHeader
