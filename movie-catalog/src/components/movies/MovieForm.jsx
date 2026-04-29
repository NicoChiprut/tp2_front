import { useState, useEffect } from 'react'

const GENRES = ['Acción','Animación','Ciencia Ficción','Comedia','Documental','Drama','Fantasy','Horror','Musical','Romance','Sci-Fi','Terror','Thriller','Western']

const EMPTY_FORM = { title:'', year:'', director:'', genre:'', rating:'', poster_url:'', review:'', watched:false }

export default function MovieForm({ movie, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const isEditing = Boolean(movie)

  useEffect(() => {
    if (movie) {
      setForm({
        title: movie.title || '',
        year: movie.year || '',
        director: movie.director || '',
        genre: movie.genre || '',
        rating: movie.rating || '',
        poster_url: movie.poster_url || '',
        review: movie.review || '',
        watched: movie.watched || false,
      })
    }
  }, [movie])

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'El título es obligatorio'
    if (form.year && (form.year < 1888 || form.year > new Date().getFullYear() + 5)) e.year = 'Año inválido'
    if (form.rating && (form.rating < 0 || form.rating > 10)) e.rating = 'La calificación debe estar entre 0 y 10'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      year: form.year ? parseInt(form.year) : null,
      rating: form.rating ? parseFloat(form.rating) : null,
    })
  }

  const inputClass = `w-full bg-black/40 border text-white placeholder-white/20 font-body text-sm rounded px-3 py-2.5 focus:outline-none focus:border-cinema-red/50 transition-colors`

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-cinema-gray border border-white/10 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="font-display text-2xl text-white tracking-widest">
            {isEditing ? 'EDITAR PELÍCULA' : 'AGREGAR PELÍCULA'}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-2xl transition-colors leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs text-white/50 font-body uppercase tracking-wider mb-1.5">Título *</label>
            <input type="text" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="Ej: El Padrino" 
              className={`${inputClass} ${errors.title ? 'border-cinema-red/60' : 'border-white/10'}`} />
            {errors.title && <p className="text-cinema-red text-xs mt-1 font-body">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 font-body uppercase tracking-wider mb-1.5">Año</label>
              <input type="number" value={form.year} onChange={e => setForm(p => ({...p, year: e.target.value}))} placeholder="2024" min={1888} max={2030}
                className={`${inputClass} ${errors.year ? 'border-cinema-red/60' : 'border-white/10'}`} />
              {errors.year && <p className="text-cinema-red text-xs mt-1 font-body">{errors.year}</p>}
            </div>
            <div>
              <label className="block text-xs text-white/50 font-body uppercase tracking-wider mb-1.5">Calificación (0-10)</label>
              <input type="number" value={form.rating} onChange={e => setForm(p => ({...p, rating: e.target.value}))} placeholder="8.5" min={0} max={10} step={0.1}
                className={`${inputClass} ${errors.rating ? 'border-cinema-red/60' : 'border-white/10'}`} />
              {errors.rating && <p className="text-cinema-red text-xs mt-1 font-body">{errors.rating}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/50 font-body uppercase tracking-wider mb-1.5">Director</label>
            <input type="text" value={form.director} onChange={e => setForm(p => ({...p, director: e.target.value}))} placeholder="Ej: Francis Ford Coppola" 
              className={`${inputClass} border-white/10`} />
          </div>

          <div>
            <label className="block text-xs text-white/50 font-body uppercase tracking-wider mb-1.5">Género</label>
            <select value={form.genre} onChange={e => setForm(p => ({...p, genre: e.target.value}))}
              className="w-full bg-black/40 border border-white/10 text-white font-body text-sm rounded px-3 py-2.5 focus:outline-none focus:border-cinema-red/50 transition-colors">
              <option value="">Seleccionar género</option>
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs text-white/50 font-body uppercase tracking-wider mb-1.5">URL del Póster</label>
            <input type="url" value={form.poster_url} onChange={e => setForm(p => ({...p, poster_url: e.target.value}))} placeholder="https://..." 
              className={`${inputClass} border-white/10`} />
          </div>

          <div>
            <label className="block text-xs text-white/50 font-body uppercase tracking-wider mb-1.5">Reseña personal</label>
            <textarea value={form.review} onChange={e => setForm(p => ({...p, review: e.target.value}))} placeholder="Tu opinión sobre la película..." rows={3}
              className="w-full bg-black/40 border border-white/10 text-white placeholder-white/20 font-body text-sm rounded px-3 py-2.5 focus:outline-none focus:border-cinema-red/50 transition-colors resize-none" />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => setForm(p => ({...p, watched: !p.watched}))}
              className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${form.watched ? 'bg-green-600' : 'bg-white/10'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.watched ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm text-white/60 font-body">{form.watched ?  'Ya la vi ✓'  : 'Pendiente de ver'}</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 bg-cinema-red hover:bg-red-700 disabled:opacity-50 text-white font-body font-semibold text-sm py-2.5 rounded transition-colors">
              {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Agregar al catálogo'}
            </button>
            <button type="button" onClick={onClose}
              className="px-4 bg-white/5 hover:bg-white/10 text-white/60 font-body text-sm py-2.5 rounded transition-colors border border-white/10">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}