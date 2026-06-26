import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerPatient, extractErrorMessage } from '../../api/auth'
import './PatientSignup.css'

const LOGO_URL = 'https://www.figma.com/api/mcp/asset/9b0d94e4-e4f9-43fd-a2af-eadfe0ee66aa'
const EYE_ICON_URL = 'https://www.figma.com/api/mcp/asset/bbfacca5-e49c-4901-aefa-6710c50c262b'
const DNI_SCAN_URL = 'https://www.figma.com/api/mcp/asset/fee5ebb5-0de6-411c-a189-9c954c06ca8a'
const INFO_ICON_URL = 'https://www.figma.com/api/mcp/asset/638d713e-2e4f-4302-acae-2c6299ff2d15'
const DROPDOWN_ARROW_URL = 'https://www.figma.com/api/mcp/asset/94f8d3d5-4db0-4f38-bdd5-e868a5f6c1aa'

const PatientSignup = () => {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [sexo, setSexo] = useState('')
  const [obraSocial, setObraSocial] = useState('')
  const [telefono, setTelefono] = useState('')
  const [cuil, setCuil] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await registerPatient({
        firstName: nombre,
        lastName: apellido,
        email,
        password,
        phoneNumber: telefono,
        dateOfBirth: fechaNacimiento,
        gender: sexo,
        dni: cuil || undefined,
      })
      navigate('/patients/login')
    } catch (err) {
      setError(extractErrorMessage(err, 'Error al registrarse'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="patient-signup">
      <div className="patient-signup__shell">

        <div className="patient-signup__brand">
          <div className="patient-signup__logo-wrap">
            <img src={LOGO_URL} alt="MedEx logo" className="patient-signup__logo" />
          </div>
          <div className="patient-signup__brand-text">
            <h1 className="patient-signup__brand-name">MedEx</h1>
            <p className="patient-signup__brand-sub">Tu salud, en un solo lugar</p>
          </div>
        </div>

        <div className="patient-signup__card">
          <div className="patient-signup__card-header">
            <h2 className="patient-signup__title">Bienvenido&nbsp;</h2>
            <p className="patient-signup__subtitle">Cree una cuenta para empezar a navegar</p>
          </div>

          <form className="patient-signup__form" onSubmit={handleSignup}>

            {/* Nombre + Apellido */}
            <div className="patient-signup__fields-group">
              <div className="patient-signup__field">
                <label className="patient-signup__label">Nombre</label>
                <input
                  className="patient-signup__input"
                  type="text"
                  placeholder="Juan"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="patient-signup__field">
                <label className="patient-signup__label">Apellido</label>
                <input
                  className="patient-signup__input"
                  type="text"
                  placeholder="García"
                  value={apellido}
                  onChange={e => setApellido(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="patient-signup__field">
              <label className="patient-signup__label">Email</label>
              <input
                className="patient-signup__input"
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Contraseña */}
            <div className="patient-signup__field">
              <label className="patient-signup__label">Contraseña</label>
              <div className="patient-signup__password-wrap">
                <input
                  className="patient-signup__input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mín. 8 caracteres, mayúscula y número"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="patient-signup__eye-btn"
                  onClick={() => setShowPassword(v => !v)}
                >
                  <img src={EYE_ICON_URL} alt="Ver contraseña" className="patient-signup__eye-icon" />
                </button>
              </div>
            </div>

            {/* Teléfono */}
            <div className="patient-signup__field">
              <label className="patient-signup__label">Teléfono</label>
              <input
                className="patient-signup__input"
                type="tel"
                placeholder="+54 11 1234-5678"
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
                required
              />
            </div>

            {/* Fecha de nacimiento */}
            <div className="patient-signup__field">
              <label className="patient-signup__label">Fecha de nacimiento</label>
              <input
                className="patient-signup__input"
                type="date"
                value={fechaNacimiento}
                onChange={e => setFechaNacimiento(e.target.value)}
                required
              />
            </div>

            {/* Sexo biológico */}
            <div className="patient-signup__field">
              <label className="patient-signup__label">Sexo biológico / género</label>
              <div className="patient-signup__input patient-signup__input--bordered patient-signup__select-wrap">
                <select
                  className="patient-signup__select"
                  value={sexo}
                  onChange={e => setSexo(e.target.value)}
                  required
                >
                  <option value="" disabled />
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                  <option value="prefiero_no_decir">Prefiero no especificar</option>
                </select>
              </div>
            </div>

            {/* Obra Social / Prepaga */}
            <div className="patient-signup__field">
              <label className="patient-signup__label">Obra Social/Prepaga</label>
              <div className="patient-signup__input patient-signup__input--bordered patient-signup__select-wrap">
                <select
                  className="patient-signup__select"
                  value={obraSocial}
                  onChange={e => setObraSocial(e.target.value)}
                >
                  <option value="" disabled />
                  <option value="osde">OSDE</option>
                  <option value="swiss_medical">Swiss Medical</option>
                  <option value="galeno">Galeno</option>
                  <option value="particular">Particular</option>
                </select>
                <img src={DROPDOWN_ARROW_URL} alt="" className="patient-signup__dropdown-arrow" />
              </div>
            </div>

            {/* Identity verification */}
            <div className="patient-signup__identity">
              <div className="patient-signup__identity-header">
                <h3 className="patient-signup__identity-title">Verifique su Identidad</h3>
                <p className="patient-signup__identity-sub">
                  Requerido para el acceso a datos<br />sensibles de salud.
                </p>
              </div>

              <div className="patient-signup__identity-cards">
                {/* DNI Scan card */}
                <div className="patient-signup__dni-card">
                  <div className="patient-signup__dni-icon-wrap">
                    <img src={DNI_SCAN_URL} alt="Escanear DNI" className="patient-signup__dni-icon" />
                  </div>
                  <span className="patient-signup__dni-text">Escanear DNI</span>
                </div>

                {/* CUIL card */}
                <div className="patient-signup__cuil-card">
                  <label className="patient-signup__cuil-label">INGRESO MANUAL</label>
                  <div className="patient-signup__cuil-input-wrap">
                    <input
                      className="patient-signup__cuil-input"
                      type="text"
                      placeholder="CUIL (20-XXXXXXXX-X)"
                      value={cuil}
                      onChange={e => setCuil(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Info box */}
              <div className="patient-signup__info-box">
                <img src={INFO_ICON_URL} alt="" className="patient-signup__info-icon" />
                <p className="patient-signup__info-text">
                  Validamos su información con las bases oficiales de{' '}
                  <strong className="patient-signup__info-highlight">SISA</strong> y{' '}
                  <strong className="patient-signup__info-highlight">ANSES</strong>{' '}
                  para garantizar su seguridad.
                </p>
              </div>
            </div>

            {error && <p className="patient-signup__error">{error}</p>}

            {/* Submit */}
            <div className="patient-signup__submit-wrap">
              <button type="submit" className="patient-signup__btn-primary" disabled={isLoading}>
                {isLoading ? 'Registrando...' : 'Registrate'}
              </button>
            </div>

            {/* Divider */}
            <div className="patient-signup__divider">
              <span className="patient-signup__divider-line" />
              <span className="patient-signup__divider-text">¿Ya tienes una cuenta?</span>
              <span className="patient-signup__divider-line" />
            </div>

            {/* Login link */}
            <button
              type="button"
              className="patient-signup__btn-secondary"
              onClick={() => navigate('/patients/login')}
            >
              Iniciar Sesión
            </button>

          </form>
        </div>

      </div>
    </div>
  )
}

export default PatientSignup
