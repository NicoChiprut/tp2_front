export function calcularEstadisticas(movies) {
    const total = movies.length
    const watched = movies.filter(m => m.watched).length
    const rated = movies.filter(m => m.rating)
    const avgRating = rated.length
      ? (rated.reduce((acc, m) => acc + parseFloat(m.rating), 0) / rated.length).toFixed(1)
      : 0
  
    return { total, watched, avgRating }
  }
  
  export function filtrarPorEstado(movies, estado) {
    if (estado === 'watched') return movies.filter(m => m.watched)
    if (estado === 'pending') return movies.filter(m => !m.watched)
    return movies
  }
  
  export function filtrarPorGenero(movies, genero) {
    if (!genero) return movies
    return movies.filter(m => m.genre === genero)
  }