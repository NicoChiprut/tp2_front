import { useState, useMemo } from 'react'
import { useMovies } from '../hooks/useMovies'
import MovieCard from '../components/movies/MovieCard'
import MovieForm from '../components/movies/MovieForm'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const FILTER_OPTIONS = ['Todas', 'Vistas', 'Pendientes']
const GENRE_FILTER = ['Todos','Acción','Comedia','Drama','Terror','Sci-Fi','Thriller','Romance','Animación','Documental']

export default function Catalog() {
  const { movies, loading, stats, addMovie, updateMovie, deleteMovie, toggleWatched } = useMovies()
  const [showForm, setShowForm] = useState(false)
  const [editingMovie, setEditingMovie] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Todas')
  const [genreFilter, setGenreFilter] = useState('Todos')
  const [sortBy, setSortBy] = useState('recent')

  const handleAdd = async (data) => {
    setSubmitting(true)
    try { await addMovie(data); setShowForm(false) }
    finally { setSubmitting(false) }
  }

  const handleEdit = async (data) => {
    setSubmitting(true)
    try { await updateMovie(editingMovie.id, data); setEditingMovie(null) }
    finally { setSubmitting(false) }
  }

  const filtered = useMemo(() => {
    let result = [...movies]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(m => 
        m.title?.toLowerCase().includes(q) || 
        m.director?.toLowerCase().includes(q) || 
        m.genre?.toLowerCase().includes(q)
      )
    }
    if (statusFilter === 'Vistas') result = result.filter(m => m.watched)
    if (statusFilter === 'Pendientes') result = result.filter(m => !m.watched)
    if (genreFilter !== 'Todos') result = result.filter(m => m.genre === genreFilter)
    if (sortBy === 'recent') result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    if (sortBy === 'title') result.sort((a, b) => a.title.localeCompare(b.title))
    if (sortBy === 'year') result.sort((a, b) => (b.year || 0) - (a.year || 0))
    if (sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    return result
  }, [movies, search, statusFilter, genreFilter, sortBy])

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner size="lg" text="Cargando tu catálogo..." />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl text-white tracking-widest">MI CATÁLOGO</h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-white/40 font-body text-sm">{stats.total} películas</span>
            <span className="text-white/20">·</span>
            <span className="text-green-400/60 font-body text-sm">{stats.watched} vistas</span>
            {stats.avgRating > 0 && <>
              <span className="text-white/20">·</span>
              <span className="text-cinema-gold/70 font-body text-sm">★ {stats.avgRating} promedio</span>
            </>}
          </div>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-cinema-red hover:bg-red-700 text-white font-body font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0">
          <span className="text-lg leading-none">+</span> Agregar película
        </button>
      </div>

      {stats.total > 0 && (
        <div className="bg-cinema-gray border border-white/5 rounded-xl p-4">
          <div className="h-2 bg-black/50 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cinema-red to-cinema-red/60 rounded-full transition-all duration-700"
              style={{ width: `${(stats.watched / stats.total) * 100}%` }} />
          </div>
          <p className="text-white/30 font-body text-xs mt-2">
            Progreso: {stats.watched}/{stats.total} vistas ({Math.round((stats.watched / stats.total) * 100)}%)
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por título, director o género..."
            className="w-full bg-cinema-gray border border-white/10 text-white placeholder-white/20 font-body text-sm rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-cinema-red/50 transition-colors" />
        </div>
        <div className="flex bg-cinema-gray border border-white/10 rounded-lg overflow-hidden">
          {FILTER_OPTIONS.map(opt => (
            <button key={opt} onClick={() => setStatusFilter(opt)}
              className={`px-4 py-2.5 text-xs font-body transition-colors ${statusFilter === opt ? 'bg-cinema-red text-white' : 'text-white/40 hover:text-white/70'}`}>
              {opt}
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="bg-cinema-gray border border-white/10 text-white/60 font-body text-sm rounded-lg px-3 py-2.5 focus:outline-none">
          <option value="recent">Más recientes</option>
          <option value="title">Título A-Z</option>
          <option value="year">Año</option>
          <option value="rating">Calificación</option>
        </select>
      </div>

      <div className="flex gap-2 flex-wrap -mt-4">
        {GENRE_FILTER.map(g => (
          <button key={g} onClick={() => setGenreFilter(g)}
            className={`text-xs font-body px-3 py-1 rounded-full border transition-colors ${genreFilter === g ? 'bg-cinema-red border-cinema-red text-white' : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'}`}>
            {g}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          {movies.length === 0 ? (
            <>
              <span className="text-6xl opacity-20">🎬</span>
              <p className="text-white/30 font-body text-lg">Tu catálogo está vacío</p>
              <button onClick={() => setShowForm(true)} className="mt-2 bg-cinema-red hover:bg-red-700 text-white font-body text-sm px-6 py-2.5 rounded-lg transition-colors">
                + Agregar película
              </button>
            </>
          ) : (
            <>
              <span className="text-4xl opacity-20">🔍</span>
              <p className="text-white/30 font-body">No se encontraron resultados</p>
              <button onClick={() => { setSearch(''); setStatusFilter('Todas'); setGenreFilter('Todos') }}
                className="text-cinema-red font-body text-sm hover:text-red-400 transition-colors">
                Limpiar filtros
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map(movie => (
            <MovieCard key={movie.id} movie={movie} 
              onEdit={m => setEditingMovie(m)}
              onDelete={deleteMovie}
              onToggleWatched={toggleWatched}
            />
          ))}
        </div>
      )}

      {showForm && <MovieForm onSubmit={handleAdd} onClose={() => setShowForm(false)} loading={submitting} />}
      {editingMovie && <MovieForm movie={editingMovie} onSubmit={handleEdit} onClose={() => setEditingMovie(null)} loading={submitting} />}
    </div>
  )
}