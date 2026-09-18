import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { registerDoctor } from '../../api/doctorAuth'
import './DoctorSignup.css'

const ESPECIALIDADES = [
  'Medicina General',
  'Cardiología',
  'Dermatología',
  'Pediatría',
  'Ginecología',
  'Neurología',
  'Ortopedia',
  'Psicología',
  'Endocrinología',
]

const DoctorSignup = () => {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [telefono, setTelefono] = useState('')
  const [especialidad, setEspecialidad] = useState('')
  const [matricula, setMatricula] = useState('')
  const [hospital, setHospital] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    const sanitizedPhone = telefono
      .replace(/[^0-9+]/g, '')
      .replace(/(?!^\+)\+/g, '')
      .trim()

    try {
      await registerDoctor({
        nombre,
        apellido,
        email,
        password,
        telefono: sanitizedPhone,
        especialidad,
        matricula,
        hospital,
      })
      navigate('/doctors/login')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Error al crear la cuenta')
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Error al crear la cuenta')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="doctor-signup">
      <div className="doctor-signup__shell">
        <div className="doctor-signup__header">
          <div>
            <span className="doctor-signup__eyebrow">MedEx</span>
            <h1 className="doctor-signup__title">Únete a la Red MedEx</h1>
            <p className="doctor-signup__subtitle">
              Completa tu registro para acceder al portal de gestión clínica más avanzado.
              Nuestro sistema está diseñado para optimizar tu tiempo y mejorar la atención al paciente.
            </p>
          </div>

          <button
            type="button"
            className="doctor-signup__login-link"
            onClick={() => navigate('/doctors/login')}
          >
            Iniciar Sesión
          </button>
        </div>

        <form className="doctor-signup__form" onSubmit={handleSubmit}>
          <section className="doctor-signup__card">
            <div className="doctor-signup__card-header">
              <h2>Datos Personales</h2>
            </div>

            <div className="doctor-signup__fields-grid">
              <label className="doctor-signup__field">
                <span>Nombre</span>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </label>
              <label className="doctor-signup__field">
                <span>Apellidos</span>
                <input
                  type="text"
                  placeholder="Apellidos"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
              </label>
              <label className="doctor-signup__field">
                <span>Correo Electrónico</span>
                <input
                  type="email"
                  placeholder="doctor@medexhealth.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label className="doctor-signup__field doctor-signup__field--password">
                <span>Contraseña</span>
                <div className="doctor-signup__password-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="doctor-signup__password-toggle"
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? 'Ocultar' : 'Ver'}
                  </button>
                </div>
              </label>
              <label className="doctor-signup__field">
                <span>Teléfono de Contacto</span>
                <input
                  type="tel"
                  placeholder="+54 11 1234-5678"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                />
              </label>
            </div>
          </section>

          <section className="doctor-signup__card">
            <div className="doctor-signup__card-header">
              <h2>Datos Profesionales</h2>
            </div>

            <div className="doctor-signup__fields-grid">
              <label className="doctor-signup__field doctor-signup__field--full">
                <span>Especialidad Médica</span>
                <select
                  value={especialidad}
                  onChange={(e) => setEspecialidad(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Seleccione una especialidad...
                  </option>
                  {ESPECIALIDADES.map((especialidadOption) => (
                    <option key={especialidadOption} value={especialidadOption}>
                      {especialidadOption}
                    </option>
                  ))}
                </select>
              </label>
              <label className="doctor-signup__field">
                <span>Número de Colegiado</span>
                <input
                  type="text"
                  placeholder="EJ-12345"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  required
                />
              </label>
              <label className="doctor-signup__field doctor-signup__field--full">
                <span>Hospital / Clínica Principal</span>
                <input
                  type="text"
                  placeholder="Nombre de la institución"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  required
                />
              </label>
            </div>
          </section>

          {error && <p className="doctor-signup__error">{error}</p>}

          <button type="submit" className="doctor-signup__submit" disabled={isLoading}>
            {isLoading ? 'Creando cuenta...' : 'Completar Registro →'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default DoctorSignup
