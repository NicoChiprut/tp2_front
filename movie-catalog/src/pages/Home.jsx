import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-cinema-black flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cinema-red/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative text-center space-y-6 px-6 animate-slide-up">
        <div className="space-y-2">
          <p className="font-body text-cinema-red text-sm uppercase tracking-[0.3em]">Bienvenido a</p>
          <h1 className="font-display text-[7rem] sm:text-[10rem] text-white tracking-widest leading-none">CINELOG</h1>
          <p className="font-body text-white/40 text-lg max-w-md mx-auto">
            Tu catálogo personal de películas. Guardá, calificá y organizá todo lo que viste y lo que querés ver.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {user ? (
            <Link to="/catalog" className="bg-cinema-red hover:bg-red-700 text-white font-body font-semibold px-8 py-3 rounded-lg transition-colors tracking-wide text-sm">
              Ir a mi catálogo →
            </Link>
          ) : (
            <>
              <Link to="/register" className="bg-cinema-red hover:bg-red-700 text-white font-body font-semibold px-8 py-3 rounded-lg transition-colors tracking-wide text-sm">
                Empezar gratis
              </Link>
              <Link to="/login" className="border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-body font-semibold px-8 py-3 rounded-lg transition-colors tracking-wide text-sm">
                Iniciar sesión
              </Link>
            </>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6 pt-12 max-w-lg mx-auto">
          {[
            { icon: '🎬', label: 'Agregá películas' },
            { icon:  '⭐' , label: 'Calificá y reseñá' },
            { icon: '📊', label: 'Seguí tu progreso' },
          ].map(f => (
            <div key={f.label} className="text-center space-y-2">
              <div className="text-3xl">{f.icon}</div>
              <p className="text-white/30 font-body text-xs uppercase tracking-wider">{f.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}