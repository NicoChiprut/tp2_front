import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(form.email, form.password)
      navigate('/catalog')
    } catch (err) {
      toast.error(err.message === 'Invalid login credentials' 
        ? 'Email o contraseña incorrectos' 
        : 'Error al iniciar sesión'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cinema-black flex">
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden bg-[#0d0d0d]">
        <div className="absolute inset-0 bg-gradient-to-br from-cinema-red/10 to-transparent" />
        <div className="relative text-center space-y-4 px-12">
          <h1 className="font-display text-8xl text-white tracking-widest">CINELOG</h1>
          <p className="font-body text-white/30 text-lg max-w-sm">
            Tu catálogo personal de películas. Guardá, calificá y organizá todo lo que viste.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-[480px] flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8 animate-fade-in">
          <div>
            <h2 className="font-display text-3xl text-white tracking-wider">INICIAR SESIÓN</h2>
            <p className="text-white/40 font-body text-sm mt-1">Ingresá a tu cuenta para acceder a tu catálogo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-white/50 font-body uppercase tracking-wider mb-2">Email</label>
              <input type="email" required value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="tu@email.com"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 font-body text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-cinema-red/60 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-white/50 font-body uppercase tracking-wider mb-2">Contraseña</label>
              <input type="password" required value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 font-body text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-cinema-red/60 transition-colors" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-cinema-red hover:bg-red-700 disabled:opacity-60 text-white font-body font-semibold text-sm py-3 rounded-lg transition-colors tracking-wide mt-2">
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="text-center text-white/40 font-body text-sm">
            ¿No tenés cuenta?{' '}
            <Link to="/register" className="text-cinema-red hover:text-red-400 transition-colors font-semibold">Registrate</Link>
          </p>
        </div>
      </div>
    </div>
  )
}