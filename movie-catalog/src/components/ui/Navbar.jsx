import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
      toast.success('Sesión cerrada')
    } catch {
      toast.error('Error al cerrar sesión')
    }
  }

  const username = user?.user_metadata?.username || user?.email?.split('@')[0]

  return (
    <nav className="bg-cinema-black border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/catalog" className="flex items-center gap-2 group">
          <span className="text-cinema-red text-2xl">🎬</span>
          <span className="font-display text-3xl text-white tracking-widest group-hover:text-cinema-red transition-colors">
            CINELOG
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-6">
            <Link
              to="/catalog"
              className="font-body text-sm text-white/60 hover:text-cinema-gold transition-colors tracking-wide uppercase"
            >
              Catálogo
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cinema-red/20 border border-cinema-red/40 flex items-center justify-center">
                <span className="text-cinema-red text-xs font-body font-semibold uppercase">
                  {username?.[0]}
                </span>
              </div>
              <span className="text-white/50 text-sm font-body hidden sm:block">{username}</span>
              <button
                onClick={handleSignOut}
                className="text-xs text-white/40 hover:text-cinema-red transition-colors font-body uppercase tracking-wider border border-white/10 hover:border-cinema-red/40 px-3 py-1.5 rounded"
              >
                Salir
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}