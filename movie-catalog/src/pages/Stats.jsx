import { useMemo } from 'react'
import { useMovies } from '../hooks/useMovies'
import LoadingSpinner from '../components/ui/LoadingSpinner'

function BarChart({ data, maxValue, colorClass = 'bg-cinema-red' }) {
  return (
    <div className="space-y-2">
      {data.map(({ label, value }) => (
        <div key={label} className="flex items-center gap-3">
          <span className="text-white/50 font-body text-xs w-24 shrink-0 truncate">{label}</span>
          <div className="flex-1 h-5 bg-black/40 rounded overflow-hidden">
            <div
              className={`h-full ${colorClass} rounded transition-all duration-700`}
              style={{ width: maxValue ? `${(value / maxValue) * 100}%` : '0%' }}
            />
          </div>
          <span className="text-white/40 font-body text-xs w-6 text-right shrink-0">{value}</span>
        </div>
      ))}
    </div>
  )
}

function StatCard({ label, value, sub, accent = false }) {
  return (
    <div className={`bg-cinema-gray border rounded-xl p-5 ${accent ? 'border-cinema-red/30' : 'border-white/5'}`}>
      <p className={`font-display text-4xl ${accent ? 'text-cinema-red' : 'text-white'}`}>{value}</p>
      <p className="text-white/50 font-body text-xs uppercase tracking-wider mt-1">{label}</p>
      {sub && <p className="text-white/25 font-body text-xs mt-0.5">{sub}</p>}
    </div>
  )
}

export default function Stats() {
  const { movies, loading, stats } = useMovies()

  const computed = useMemo(() => {
    if (!movies.length) return null

    // Distribución por género
    const genreMap = {}
    movies.forEach(m => {
      if (m.genre) genreMap[m.genre] = (genreMap[m.genre] || 0) + 1
    })
    const genreData = Object.entries(genreMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([label, value]) => ({ label, value }))

    // Distribución por calificación
    const ratingBuckets = { '9-10': 0, '7-8': 0, '5-6': 0, '3-4': 0, '1-2': 0 }
    movies.filter(m => m.rating).forEach(m => {
      const r = parseFloat(m.rating)
      if (r >= 9) ratingBuckets['9-10']++
      else if (r >= 7) ratingBuckets['7-8']++
      else if (r >= 5) ratingBuckets['5-6']++
      else if (r >= 3) ratingBuckets['3-4']++
      else ratingBuckets['1-2']++
    })
    const ratingData = Object.entries(ratingBuckets)
      .map(([label, value]) => ({ label, value }))

    // Top 5 mejor calificadas
    const topRated = [...movies]
      .filter(m => m.rating)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5)

    // Películas por año (últimos 10 años)
    const yearMap = {}
    const currentYear = new Date().getFullYear()
    movies.filter(m => m.year && m.year >= currentYear - 9).forEach(m => {
      yearMap[m.year] = (yearMap[m.year] || 0) + 1
    })
    const yearData = Object.entries(yearMap)
      .sort((a, b) => b[0] - a[0])
      .slice(0, 8)
      .map(([label, value]) => ({ label, value }))

    // Recientes (últimas 5)
    const recent = [...movies]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)

    const pendingCount = movies.filter(m => !m.watched).length
    const ratedCount = movies.filter(m => m.rating).length
    const watchedPercent = stats.total ? Math.round((stats.watched / stats.total) * 100) : 0

    return { genreData, ratingData, topRated, yearData, recent, pendingCount, ratedCount, watchedPercent }
  }, [movies, stats])

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner size="lg" text="Calculando estadísticas..." />
    </div>
  )

  if (!movies.length) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <span className="text-5xl opacity-20">📊</span>
      <p className="text-white/30 font-body">Agregá películas para ver tus estadísticas</p>
    </div>
  )

  const maxGenre = computed.genreData[0]?.value || 1
  const maxRating = Math.max(...computed.ratingData.map(d => d.value), 1)
  const maxYear = Math.max(...computed.yearData.map(d => d.value), 1)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      <h1 className="font-display text-5xl text-white tracking-widest">ESTADÍSTICAS</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total" value={stats.total} accent />
        <StatCard label="Vistas" value={stats.watched} sub={`${computed.watchedPercent}% del catálogo`} />
        <StatCard label="Pendientes" value={computed.pendingCount} />
        <StatCard label="Calificación prom." value={stats.avgRating > 0 ? `★ ${stats.avgRating}` : '—'} sub={`${computed.ratedCount} calificadas`} />
      </div>

      {/* Progress */}
      <div className="bg-cinema-gray border border-white/5 rounded-xl p-5">
        <div className="flex justify-between items-center mb-3">
          <p className="text-white/60 font-body text-sm">Progreso del catálogo</p>
          <p className="text-cinema-red font-display text-2xl">{computed.watchedPercent}%</p>
        </div>
        <div className="h-3 bg-black/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cinema-red to-red-400 rounded-full transition-all duration-1000"
            style={{ width: `${computed.watchedPercent}%` }}
          />
        </div>
        <p className="text-white/20 font-body text-xs mt-2">{stats.watched} de {stats.total} películas vistas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Géneros */}
        {computed.genreData.length > 0 && (
          <div className="bg-cinema-gray border border-white/5 rounded-xl p-5 space-y-4">
            <p className="text-white/60 font-body text-sm uppercase tracking-widest">Por género</p>
            <BarChart data={computed.genreData} maxValue={maxGenre} colorClass="bg-cinema-red" />
          </div>
        )}

        {/* Calificaciones */}
        {computed.ratedCount > 0 && (
          <div className="bg-cinema-gray border border-white/5 rounded-xl p-5 space-y-4">
            <p className="text-white/60 font-body text-sm uppercase tracking-widest">Distribución de calificaciones</p>
            <BarChart data={computed.ratingData} maxValue={maxRating} colorClass="bg-cinema-gold" />
          </div>
        )}

        {/* Por año */}
        {computed.yearData.length > 0 && (
          <div className="bg-cinema-gray border border-white/5 rounded-xl p-5 space-y-4">
            <p className="text-white/60 font-body text-sm uppercase tracking-widest">Por año (últimos 10)</p>
            <BarChart data={computed.yearData} maxValue={maxYear} colorClass="bg-blue-500" />
          </div>
        )}

        {/* Top 5 */}
        {computed.topRated.length > 0 && (
          <div className="bg-cinema-gray border border-white/5 rounded-xl p-5 space-y-4">
            <p className="text-white/60 font-body text-sm uppercase tracking-widest">Top 5 mejor calificadas</p>
            <div className="space-y-3">
              {computed.topRated.map((movie, i) => (
                <div key={movie.id} className="flex items-center gap-3">
                  <span className={`font-display text-2xl ${i === 0 ? 'text-cinema-gold' : 'text-white/20'}`}>
                    {i + 1}
                  </span>
                  {movie.poster_url && (
                    <img src={movie.poster_url} alt={movie.title} className="w-8 h-12 object-cover rounded" onError={e => e.target.style.display='none'} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-body text-sm font-semibold truncate">{movie.title}</p>
                    <p className="text-white/30 font-body text-xs">{movie.year || '—'} · {movie.genre || '—'}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-cinema-gold text-xs">★</span>
                    <span className="text-white font-body text-sm font-semibold">{movie.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Agregadas recientemente */}
      <div className="bg-cinema-gray border border-white/5 rounded-xl p-5 space-y-4">
        <p className="text-white/60 font-body text-sm uppercase tracking-widest">Agregadas recientemente</p>
        <div className="divide-y divide-white/5">
          {computed.recent.map(movie => (
            <div key={movie.id} className="flex items-center justify-between py-3 gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {movie.poster_url && (
                  <img src={movie.poster_url} alt={movie.title} className="w-8 h-12 object-cover rounded shrink-0" onError={e => e.target.style.display='none'} />
                )}
                <div className="min-w-0">
                  <p className="text-white font-body text-sm font-semibold truncate">{movie.title}</p>
                  <p className="text-white/30 font-body text-xs">{movie.year || '—'}{movie.genre ? ` · ${movie.genre}` : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {movie.rating && <span className="text-cinema-gold font-body text-xs">★ {movie.rating}</span>}
                <span className={`text-xs font-body px-2 py-0.5 rounded-full ${movie.watched ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/30'}`}>
                  {movie.watched ? 'Vista' : 'Pendiente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}