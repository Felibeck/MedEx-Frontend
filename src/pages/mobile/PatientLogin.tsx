import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  EyeIcon,
  EyeSlashIcon,
  FingerPrintIcon,
  LockClosedIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/solid'
import './PatientLogin.css'
import { loginPatient } from '../../api/patientAuth'
import axios from 'axios'

const PatientLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      const userSession = await loginPatient(email, password)
      localStorage.setItem('medex_user_id', userSession.id)
      localStorage.setItem('medex_user', JSON.stringify(userSession))
      navigate('/patients')
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
    <div className="patient-login">
      <div className="patient-login__shell">

        <div className="patient-login__brand">
          <div className="patient-login__logo-wrap">
            <img src="/medex-logo.png" alt="MedEx logo" className="patient-login__logo" />
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
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="patient-login__eye-icon" />
                  ) : (
                    <EyeIcon className="patient-login__eye-icon" />
                  )}
                </button>
              </div>
            </div>

            {error && <p className="patient-login__error">{error}</p>}

            <div className="patient-login__actions">
              <button type="submit" className="patient-login__btn-primary" disabled={isLoading}>
                {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
              </button>
              <button type="button" className="patient-login__btn-biometric" aria-label="Iniciar sesión con biométrico">
                <FingerPrintIcon className="patient-login__fingerprint" />
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
              <LockClosedIcon className="patient-login__badge-icon" aria-hidden="true" />
              <span className="patient-login__badge-text">SSL Encriptado</span>
            </div>
            <div className="patient-login__badge">
              <ShieldCheckIcon className="patient-login__badge-icon" aria-hidden="true" />
              <span className="patient-login__badge-text">Privacidad HIPAA</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default PatientLogin
