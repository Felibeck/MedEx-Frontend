import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
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
        <div className="doctor-login__hero">
          <div className="doctor-login__brand">
            <h1 className="doctor-login__brand-title">MedEx</h1>
            <p className="doctor-login__brand-subtitle">Tu salud en un mismo lugar</p>
          </div>

          <div className="doctor-login__panel">
            <h2 className="doctor-login__title">Bienvenido</h2>
            <p className="doctor-login__subtitle">Inicia sesión como doctor para acceder a tu panel.</p>

            <form className="doctor-login__form" onSubmit={handleLogin}>
              <label className="doctor-login__label" htmlFor="doctor-email">Email Address</label>
              <input
                id="doctor-email"
                className="doctor-login__input"
                type="email"
                placeholder="doctor@medexhealth.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />

              <div className="doctor-login__password-row">
                <label className="doctor-login__label" htmlFor="doctor-password">Password</label>
                <button
                  type="button"
                  className="doctor-login__show-password"
                  onClick={() => setShowPassword(value => !value)}
                >
                  {showPassword ? 'Ocultar' : 'Ver'}
                </button>
              </div>
              <input
                id="doctor-password"
                className="doctor-login__input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />

              {error && <p className="doctor-login__error">{error}</p>}

              <button type="submit" className="doctor-login__button" disabled={isLoading}>
                {isLoading ? 'Iniciando...' : 'Log In'}
              </button>

              <div className="doctor-login__divider">
                <span className="doctor-login__divider-line" />
                <span className="doctor-login__divider-text">o continuar con</span>
                <span className="doctor-login__divider-line" />
              </div>

              <div className="doctor-login__socials">
                <button type="button" className="doctor-login__social-button">Google</button>
                <button type="button" className="doctor-login__social-button">Apple</button>
              </div>

              <p className="doctor-login__footer-text">
                ¿No tienes una cuenta aun?{' '}
                <span className="doctor-login__link">Crea una cuenta</span>
              </p>
            </form>
          </div>

          <div className="doctor-login__trust">
            <p className="doctor-login__trust-text">HIPAA Compliant & Secure encrypted connection</p>
            <div className="doctor-login__trust-links">
              <button type="button" className="doctor-login__trust-link">Privacy Policy</button>
              <button type="button" className="doctor-login__trust-link">Terms of Service</button>
              <button type="button" className="doctor-login__trust-link">Contact Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorLogin
