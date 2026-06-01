import { useState, useMemo, useContext } from 'react'
import { useMovies } from '../hooks/useMovies'
import MovieCard from '../components/movies/MovieCard'
import MovieForm from '../components/movies/MovieForm'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { AuthContext } from '../context/AuthContext'

const FILTER_OPTIONS = ['Todas', 'Vistas', 'Pendientes']
const GENRE_FILTER = ['Todos','Acción','Comedia','Drama','Terror','Sci-Fi','Thriller','Romance','Animación','Documental']

export default function Catalog({ showOnlyMine = false }) {
  const { movies, loading, stats, addMovie, updateMovie, deleteMovie, toggleWatched } = useMovies()
  const { user } = useContext(AuthContext)
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

  const handleDelete = (movie) => {
    if (movie.user_id === user?.id) {
      deleteMovie(movie.id)
    } else {
      alert("No puedes borrar películas que no son tuyas.")
    }
  }

  const filtered = useMemo(() => {
    let result = [...movies]
    if (showOnlyMine) result = result.filter(m => m.user_id === user?.id)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(m => m.title?.toLowerCase().includes(q) || m.director?.toLowerCase().includes(q) || m.genre?.toLowerCase().includes(q))
    }
    if (statusFilter === 'Vistas') result = result.filter(m => m.watched)
    if (statusFilter === 'Pendientes') result = result.filter(m => !m.watched)
    if (genreFilter !== 'Todos') result = result.filter(m => m.genre === genreFilter)
    if (sortBy === 'recent') result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    if (sortBy === 'title') result.sort((a, b) => a.title.localeCompare(b.title))
    if (sortBy === 'year') result.sort((a, b) => (b.year || 0) - (a.year || 0))
    if (sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    return result
  }, [movies, search, statusFilter, genreFilter, sortBy, showOnlyMine, user?.id])

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner size="lg" text="Cargando..." /></div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl text-white tracking-widest">{showOnlyMine ? 'MI CATÁLOGO' : 'COMUNIDAD'}</h1>
        </div>
        {showOnlyMine && (
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-cinema-red hover:bg-red-700 text-white font-body font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors">
            + Agregar película
            </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="w-full bg-cinema-gray border border-white/10 text-white rounded-lg px-4 py-2.5 focus:outline-none" />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-cinema-gray border border-white/10 text-white/60 rounded-lg px-3 py-2.5">
          <option value="recent">Más recientes</option>
          <option value="title">Título</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map(movie => (
          <MovieCard key={movie.id} movie={movie} isOwner={movie.user_id === user?.id} onEdit={m => setEditingMovie(m)} onDelete={() => handleDelete(movie)} onToggleWatched={toggleWatched} />
        ))}
      </div>
      {showForm && <MovieForm onSubmit={handleAdd} onClose={() => setShowForm(false)} loading={submitting} />}
      {editingMovie && <MovieForm movie={editingMovie} onSubmit={handleEdit} onClose={() => setEditingMovie(null)} loading={submitting} />}
    </div>
  )
}
