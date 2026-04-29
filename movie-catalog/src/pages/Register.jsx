import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Las contraseñas no coinciden'); return }
    if (form.password.length < 6) { toast.error('La contraseña debe tener al menos 6 caracteres'); return }
    setLoading(true)
    try {
      await signUp(form.email, form.password, form.username)
      toast.success('¡Cuenta creada! Revisá tu email para confirmar.')
      navigate('/login')
    } catch (err) {
      toast.error(err.message?.includes('already registered') ? 'Este email ya está registrado' : 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-white/5 border border-white/10 text-white placeholder-white/20 font-body text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-cinema-red/60 transition-colors"

  return (
    <div className="min-h-screen bg-cinema-black flex items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        <div>
          <Link to="/" className="font-display text-4xl text-white tracking-widest">CINELOG</Link>
          <h2 className="font-display text-3xl text-white tracking-wider mt-2">CREAR CUENTA</h2>
          <p className="text-white/40 font-body text-sm mt-1">Empezá tu catálogo personal de películas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-white/50 font-body uppercase tracking-wider mb-2">Nombre de usuario</label>
            <input type="text" required value={form.username} onChange={e => setForm(p => ({...p, username: e.target.value}))} placeholder="cinefilo123" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs text-white/50 font-body uppercase tracking-wider mb-2">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="tu@email.com" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs text-white/50 font-body uppercase tracking-wider mb-2">Contraseña</label>
            <input type="password" required value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} placeholder="Mínimo 6 caracteres" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs text-white/50 font-body uppercase tracking-wider mb-2">Confirmar contraseña</label>
            <input type="password" required value={form.confirm} onChange={e => setForm(p => ({...p, confirm: e.target.value}))} placeholder="••••••••" className={inputClass} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-cinema-red hover:bg-red-700 disabled:opacity-60 text-white font-body font-semibold text-sm py-3 rounded-lg transition-colors tracking-wide mt-2">
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-white/40 font-body text-sm">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-cinema-red hover:text-red-400 transition-colors font-semibold">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  )
}