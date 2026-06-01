import { useMovies } from '../hooks/useMovies'
import MovieCard from '../components/movies/MovieCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function CommunityCatalog() {
  const { movies, loading } = useMovies() // Trae todas las películas

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl text-white mb-8">Catálogo de la Comunidad</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map(movie => (
          <div key={movie.id} className="relative">
            <MovieCard movie={movie} isOwner={false} /> {/* isOwner false para que no borren pelis ajenas */}
            
            {/* Indicador visual de quién la subió */}
            <div className="mt-2 text-xs text-white/30 flex items-center gap-1">
              <span>{movie.user_id === 'TU_ID_AQUI' ? '★ Tuya' : '👤 Usuario'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}