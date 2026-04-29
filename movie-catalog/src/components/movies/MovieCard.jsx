import { useState } from 'react'

const GENRE_COLORS = {
  'Acción': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Comedia': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Drama': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Terror': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Sci-Fi': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Thriller': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Romance': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Animación': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Documental': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
}

export default function MovieCard({ movie, onEdit, onDelete, onToggleWatched }) {
  const [imgError, setImgError] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const genreClass = GENRE_COLORS[movie.genre] || 'bg-white/10 text-white/50 border-white/20'

  const renderStars = (rating) => {
    if (!rating) return null
    const stars = Math.round(rating / 2)
    return (
      <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(i => (
          <span key={i} className={`text-xs ${i <= stars ? 'text-cinema-gold' : 'text-white/20'}`}>★</span>
        ))}
        <span className="text-xs text-white/50 ml-1 font-body">{rating}/10</span>
      </div>
    )
  }

  return (
    <div className={`group relative bg-cinema-gray border rounded-lg overflow-hidden transition-all duration-300 hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cinema-red/10 ${movie.watched ? 'border-white/5' : 'border-white/10'}`}>
      <div className="relative aspect-[2/3] bg-black/50 overflow-hidden">
        {movie.poster_url && !imgError ? (
          <img 
            src={movie.poster_url} 
            alt={movie.title} 
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="text-5xl opacity-20">🎬</span>
            <span className="text-white/20 text-xs font-body text-center px-4">{movie.title}</span>
          </div>
        )}
        
        {movie.watched && (
          <div className="absolute inset-0 bg-black/30 flex items-end justify-end p-2">
            <span className="bg-green-500/90 text-white text-xs font-body px-2 py-0.5 rounded-full"> ✓ Vista </span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
          <button 
            onClick={() => onEdit(movie)}
            className="bg-white/10 hover:bg-cinema-gold/80 border border-white/20 text-white text-xs font-body px-3 py-1.5 rounded transition-colors"
          >
            Editar
          </button>
          <button 
            onClick={() => onToggleWatched(movie.id, movie.watched)}
            className="bg-white/10 hover:bg-green-600/80 border border-white/20 text-white text-xs font-body px-3 py-1.5 rounded transition-colors"
          >
            {movie.watched ? 'Pendiente' :  'Vista ✓' }
          </button>
        </div>
      </div>

      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-body font-semibold text-white text-sm leading-tight line-clamp-2">{movie.title}</h3>
          <button 
            onClick={() => setShowConfirm(true)}
            className="text-white/20 hover:text-cinema-red transition-colors shrink-0 text-lg leading-none"
          >×</button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {movie.year && <span className="text-white/40 text-xs font-body">{movie.year}</span>}
          {movie.genre && (
            <span className={`text-xs font-body px-2 py-0.5 rounded-full border ${genreClass}`}>{movie.genre}</span>
          )}
        </div>

        {movie.director && <p className="text-white/30 text-xs font-body truncate">Dir. {movie.director}</p>}
        {movie.rating && renderStars(movie.rating)}
        {movie.review && <p className="text-white/40 text-xs font-body italic line-clamp-2">"{movie.review}"</p>}
      </div>

      {showConfirm && (
        <div className="absolute inset-0 bg-cinema-black/95 flex flex-col items-center justify-center gap-4 p-4 z-10">
          <p className="text-white text-sm font-body text-center">
            ¿Eliminar <span className="text-cinema-red font-semibold">{movie.title}</span>?
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => { onDelete(movie.id); setShowConfirm(false) }}
              className="bg-cinema-red text-white text-xs font-body px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >Eliminar</button>
            <button 
              onClick={() => setShowConfirm(false)}
              className="bg-white/10 text-white text-xs font-body px-4 py-2 rounded hover:bg-white/20 transition-colors"
            >Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}