import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/solid'
import { loginDoctor } from '../../api/doctorAuth'
import './DoctorLogin.css'

const DoctorLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const doctor = await loginDoctor(email, password)
      localStorage.setItem('medex_doctor', JSON.stringify(doctor))
      navigate('/doctor')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Error al iniciar sesión')
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Error al iniciar sesión')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="doctor-login">
      <div className="doctor-login__container">
        <div className="doctor-login__brand">
          <h1 className="doctor-login__brand-title">MedEx</h1>
          <p className="doctor-login__brand-subtitle">Tu salud en un mismo lugar</p>
        </div>

        <div className="doctor-login__card">
          <div className="doctor-login__panel">
            <div className="doctor-login__panel-header">
              <h2 className="doctor-login__title">Bienvenido</h2>
              <p className="doctor-login__subtitle">Inicia sesión como doctor para acceder a tu panel.</p>
            </div>

            <form className="doctor-login__form" onSubmit={handleLogin}>
              <div className="doctor-login__field">
                <label className="doctor-login__label" htmlFor="doctor-email">Email Address</label>
                <div className="doctor-login__input-wrap">
                  <EnvelopeIcon className="doctor-login__input-icon" aria-hidden="true" />
                  <input
                    id="doctor-email"
                    className="doctor-login__input"
                    type="email"
                    placeholder="doctor@medexhealth.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="doctor-login__field">
                <div className="doctor-login__password-row">
                  <label className="doctor-login__label" htmlFor="doctor-password">Password</label>
                  {/* TODO: sin funcionalidad todavía — solo visual, falta flujo de recuperación de contraseña */}
                  <button type="button" className="doctor-login__forgot">Forgot your password?</button>
                </div>
                <div className="doctor-login__input-wrap">
                  <LockClosedIcon className="doctor-login__input-icon" aria-hidden="true" />
                  <input
                    id="doctor-password"
                    className="doctor-login__input doctor-login__input--password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="doctor-login__show-password"
                    onClick={() => setShowPassword(value => !value)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="doctor-login__show-password-icon" />
                    ) : (
                      <EyeIcon className="doctor-login__show-password-icon" />
                    )}
                  </button>
                </div>
              </div>

              {error && <p className="doctor-login__error">{error}</p>}

              <button type="submit" className="doctor-login__button" disabled={isLoading}>
                <span>{isLoading ? 'Iniciando...' : 'Log In'}</span>
                {!isLoading && <ArrowRightIcon className="doctor-login__button-icon" aria-hidden="true" />}
              </button>

              <div className="doctor-login__divider">
                <span className="doctor-login__divider-line" />
                <span className="doctor-login__divider-text">o continuar con</span>
                <span className="doctor-login__divider-line" />
              </div>

              <div className="doctor-login__socials">
                <button type="button" className="doctor-login__social-button">
                  <GlobeAltIcon className="doctor-login__social-icon" aria-hidden="true" />
                  Google
                </button>
                <button type="button" className="doctor-login__social-button">
                  <ComputerDesktopIcon className="doctor-login__social-icon" aria-hidden="true" />
                  Apple
                </button>
              </div>

              <p className="doctor-login__footer-text">
                ¿No tienes una cuenta aun?{' '}
                <span className="doctor-login__link">Crea una cuenta</span>
              </p>
            </form>
          </div>
        </div>

        <div className="doctor-login__trust">
          <div className="doctor-login__trust-badge">
            <ShieldCheckIcon className="doctor-login__trust-icon" aria-hidden="true" />
            <span>HIPAA Compliant &amp; Secure encrypted connection</span>
          </div>
          <div className="doctor-login__trust-links">
            <button type="button" className="doctor-login__trust-link">Privacy Policy</button>
            <button type="button" className="doctor-login__trust-link">Terms of Service</button>
            {/* TODO: sin funcionalidad todavía */}
            <button type="button" className="doctor-login__trust-link">Cookie Settings</button>
            <button type="button" className="doctor-login__trust-link">Contact Support</button>
          </div>
          <p className="doctor-login__copyright">© {new Date().getFullYear()} MedEx. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}

export default DoctorLogin
