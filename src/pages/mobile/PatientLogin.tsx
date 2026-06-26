import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
<<<<<<< HEAD
import { loginPatient, extractErrorMessage } from '../../api/auth'
=======
 
>>>>>>> 32a88d54712f494b551dd8c8c591806c747d8e05
import './PatientLogin.css'
import { loginPatient } from '../../api/patientAuth'

const LOGO_URL = 'https://www.figma.com/api/mcp/asset/8fef63a7-1b51-484b-8702-c508916c10e1'
const EYE_ICON_URL = 'https://www.figma.com/api/mcp/asset/2541fda4-daaa-4a00-a80c-9ce56b81bb37'
const FINGERPRINT_URL = 'https://www.figma.com/api/mcp/asset/6747f183-235c-4b4b-bd1c-24c3b569dc63'
const SSL_ICON_URL = 'https://www.figma.com/api/mcp/asset/e12b7d71-5b17-4644-86de-1b00b0aca3f8'
const HIPAA_ICON_URL = 'https://www.figma.com/api/mcp/asset/edb1f948-b255-4f11-b75d-9f12633811ee'

const PatientLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
<<<<<<< HEAD
    setError(null)
    setIsLoading(true)
    try {
      const { user, token } = await loginPatient(email, password)
      localStorage.setItem('medex_token', token)
      localStorage.setItem('medex_user_id', user.id)
      localStorage.setItem('medex_user', JSON.stringify(user))
      navigate('/patients')
    } catch (err) {
      setError(extractErrorMessage(err, 'Error al iniciar sesión'))
    } finally {
      setIsLoading(false)
    }
  }
=======
    try {
      const userSession = await loginPatient(email, password)
      localStorage.setItem('user', JSON.stringify(userSession))
      navigate('/patients')
    } catch (err: any) {
      console.error(err.response?.data?.message || err.message)
    }
  } // ◄ AQUÍ cerraba la función handleLogin
>>>>>>> 32a88d54712f494b551dd8c8c591806c747d8e05

  return (
    <div className="patient-login">
      <div className="patient-login__shell">

        <div className="patient-login__brand">
          <div className="patient-login__logo-wrap">
            <img src={LOGO_URL} alt="MedEx logo" className="patient-login__logo" />
          </div>
          <div className="patient-login__brand-text">
            <h1 className="patient-login__brand-name">MedEx</h1>
            <p className="patient-login__brand-sub">&nbsp;&nbsp;&nbsp;Tu salud, en un solo lugar</p>
          </div>
        </div>

        <div className="patient-login__card">
          <div className="patient-login__card-header">
            <h2 className="patient-login__title">Bienvenido&nbsp;</h2>
            <p className="patient-login__subtitle">Inicie sesión para acceder a su<br />historial</p>
          </div>

          <form className="patient-login__form" onSubmit={handleLogin}>
            <div className="patient-login__field">
              <label className="patient-login__label">Email o Teléfono</label>
              <input
                className="patient-login__input"
                type="text"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="patient-login__field">
              <div className="patient-login__label-row">
                <label className="patient-login__label">Contraseña</label>
                <button type="button" className="patient-login__forgot">
                  ¿Olvidó su contraseña?
                </button>
              </div>
              <div className="patient-login__password-wrap">
                <input
                  className="patient-login__input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="patient-login__eye-btn"
                  onClick={() => setShowPassword(v => !v)}
                >
                  <img src={EYE_ICON_URL} alt="Ver contraseña" className="patient-login__eye-icon" />
                </button>
              </div>
            </div>

            {error && <p className="patient-login__error">{error}</p>}

            <div className="patient-login__actions">
              <button type="submit" className="patient-login__btn-primary" disabled={isLoading}>
                {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
              </button>
              <button type="button" className="patient-login__btn-biometric">
                <img src={FINGERPRINT_URL} alt="Biométrico" className="patient-login__fingerprint" />
              </button>
            </div>

            <div className="patient-login__divider">
              <span className="patient-login__divider-line" />
              <span className="patient-login__divider-text">¿No tienes una cuenta aún?</span>
              <span className="patient-login__divider-line" />
            </div>

            <button
              type="button"
              className="patient-login__btn-secondary"
              onClick={() => navigate('/patients/signup')}
            >
              Crear Cuenta
            </button>
          </form>
        </div>

        <div className="patient-login__footer">
          <p className="patient-login__footer-text">
            Al continuar, usted acepta nuestros Términos de<br />
            Servicio y Política de Privacidad de Datos Médicos.
          </p>
          <div className="patient-login__footer-badges">
            <div className="patient-login__badge">
              <img src={SSL_ICON_URL} alt="" className="patient-login__badge-icon" />
              <span className="patient-login__badge-text">SSL Encriptado</span>
            </div>
            <div className="patient-login__badge">
              <img src={HIPAA_ICON_URL} alt="" className="patient-login__badge-icon" />
              <span className="patient-login__badge-text">Privacidad HIPAA</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
} // ◄ AQUÍ cierra PatientLogin de forma correcta

export default PatientLogin