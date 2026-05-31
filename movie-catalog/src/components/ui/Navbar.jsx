import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProfile } from '../../hooks/useProfile'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const { profile } = useProfile()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
      toast.success('Sesión cerrada')
    } catch {
      toast.error('Error al cerrar sesión')
    }
  }

  const displayName = profile?.username || user?.user_metadata?.username || user?.email?.split('@')[0]

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`font-body text-sm transition-colors tracking-wide uppercase ${
        location.pathname === to
          ? 'text-cinema-gold'
          : 'text-white/50 hover:text-white/80'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="bg-cinema-black border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/catalog" className="flex items-center gap-2 group shrink-0">
          <span className="text-cinema-red text-2xl">🎬</span>
          <span className="font-display text-3xl text-white tracking-widest group-hover:text-cinema-red transition-colors">
            CINELOG
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-5">
            <div className="hidden sm:flex items-center gap-5">
              {navLink('/catalog', 'Catálogo')}
              {navLink('/stats', 'Estadísticas')}
            </div>

            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 group">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-cinema-red/20 border border-cinema-red/30 flex items-center justify-center shrink-0">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-cinema-red text-xs font-body font-semibold uppercase">
                        {displayName?.[0]}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#39FF14] rounded-full border-2 border-cinema-black shadow-[0_0_5px_#39FF14]"></div>
                </div>
                <span className="text-white/50 text-sm font-body hidden md:block group-hover:text-white/80 transition-colors">
                  {displayName}
                </span>
              </Link>

              <button
                onClick={handleSignOut}
                className="text-xs text-white/30 hover:text-cinema-red transition-colors font-body uppercase tracking-wider border border-white/10 hover:border-cinema-red/40 px-3 py-1.5 rounded"
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