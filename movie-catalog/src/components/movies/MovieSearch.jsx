import { useState, useRef } from 'react'

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_IMG = 'https://image.tmdb.org/t/p/w200'

// Mapa de géneros TMDB → nuestros géneros
const TMDB_GENRES = {
  28: 'Acción', 12: 'Acción', 16: 'Animación', 35: 'Comedia',
  80: 'Thriller', 99: 'Documental', 18: 'Drama', 10751: 'Drama',
  14: 'Fantasy', 36: 'Drama', 27: 'Terror', 10402: 'Musical',
  9648: 'Thriller', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller',
  10752: 'Acción', 37: 'Western'
}

export default function MovieSearch({ onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const debounceRef = useRef()

  const search = async (q) => {
    if (!q.trim() || !TMDB_KEY) return
    setLoading(true)
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}&language=es-ES&page=1`
      )
      const data = await res.json()
      setResults(data.results?.slice(0, 6) || [])
      setSearched(true)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    clearTimeout(debounceRef.current)
    if (val.length >= 2) {
      debounceRef.current = setTimeout(() => search(val), 500)
    } else {
      setResults([])
      setSearched(false)
    }
  }

  const handleSelect = async (movie) => {
    // Fetch detalles + créditos para obtener director
    try {
      const [detailRes, creditsRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_KEY}&language=es-ES`),
        fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${TMDB_KEY}`)
      ])
      const detail = await detailRes.json()
      const credits = await creditsRes.json()
      const director = credits.crew?.find(p => p.job === 'Director')?.name || ''
      const genre = TMDB_GENRES[detail.genres?.[0]?.id] || ''
      const year = movie.release_date ? parseInt(movie.release_date.split('-')[0]) : ''
      const posterUrl = movie.poster_path ? `${TMDB_IMG}${movie.poster_path}` : ''

      onSelect({
        title: movie.title || '',
        year,
        director,
        genre,
        poster_url: posterUrl,
        review: '',
        rating: '',
        watched: false,
      })
    } catch {
      // Fallback sin detalles
      onSelect({
        title: movie.title || '',
        year: movie.release_date ? parseInt(movie.release_date.split('-')[0]) : '',
        director: '',
        genre: '',
        poster_url: movie.poster_path ? `${TMDB_IMG}${movie.poster_path}` : '',
        review: '',
        rating: '',
        watched: false,
      })
    }
    setQuery('')
    setResults([])
    setSearched(false)
  }

  if (!TMDB_KEY) return null

  return (
    <div className="space-y-2">
      <label className="block text-xs text-cinema-gold/70 font-body uppercase tracking-wider">
        🔍 Buscar en TMDB (autocompletar)
      </label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Escribí el nombre de la película..."
          className="w-full bg-cinema-gold/5 border border-cinema-gold/20 text-white placeholder-white/20 font-body text-sm rounded px-3 py-2.5 focus:outline-none focus:border-cinema-gold/50 transition-colors"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-white/20 border-t-cinema-gold rounded-full animate-spin" />
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="bg-black/90 border border-white/10 rounded-lg overflow-hidden divide-y divide-white/5 max-h-64 overflow-y-auto">
          {results.map(movie => (
            <button
              key={movie.id}
              type="button"
              onClick={() => handleSelect(movie)}
              className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left"
            >
              {movie.poster_path ? (
                <img src={`${TMDB_IMG}${movie.poster_path}`} alt={movie.title} className="w-8 h-12 object-cover rounded shrink-0" />
              ) : (
                <div className="w-8 h-12 bg-white/5 rounded shrink-0 flex items-center justify-center text-lg">🎬</div>
              )}
              <div className="min-w-0">
                <p className="text-white font-body text-sm font-semibold truncate">{movie.title}</p>
                <p className="text-white/40 font-body text-xs">
                  {movie.release_date?.split('-')[0] || '—'}
                  {movie.vote_average > 0 && ` · ★ ${movie.vote_average.toFixed(1)}`}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {searched && results.length === 0 && !loading && (
        <p className="text-white/30 font-body text-xs">Sin resultados para "{query}"</p>
      )}

      <div className="border-b border-white/10 pt-2" />
    </div>
  )
}