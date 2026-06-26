import { describe, it, expect } from 'vitest'
import { calcularEstadisticas, filtrarPorEstado, filtrarPorGenero } from './movieStats'

const peliculasMock = [
  { id: 1, title: 'Inception', watched: true, rating: '9', genre: 'Sci-Fi' },
  { id: 2, title: 'Titanic', watched: false, rating: '7', genre: 'Drama' },
  { id: 3, title: 'Interstellar', watched: true, rating: '8', genre: 'Sci-Fi' },
  { id: 4, title: 'Joker', watched: false, rating: null, genre: 'Drama' },
]

describe('calcularEstadisticas', () => {
  it('calcula el total, vistas y promedio correctamente', () => {
    const stats = calcularEstadisticas(peliculasMock)
    expect(stats.total).toBe(4)
    expect(stats.watched).toBe(2)
    expect(stats.avgRating).toBe('8.0')
  })

  it('retorna avgRating 0 si no hay películas calificadas', () => {
    const stats = calcularEstadisticas([{ id: 1, watched: false, rating: null }])
    expect(stats.avgRating).toBe(0)
  })
})

describe('filtrarPorEstado', () => {
  it('filtra solo las películas vistas', () => {
    const resultado = filtrarPorEstado(peliculasMock, 'watched')
    expect(resultado.length).toBe(2)
    expect(resultado.every(m => m.watched)).toBe(true)
  })

  it('filtra solo las películas pendientes', () => {
    const resultado = filtrarPorEstado(peliculasMock, 'pending')
    expect(resultado.length).toBe(2)
    expect(resultado.every(m => !m.watched)).toBe(true)
  })
})

describe('filtrarPorGenero', () => {
  it('filtra películas por género', () => {
    const resultado = filtrarPorGenero(peliculasMock, 'Sci-Fi')
    expect(resultado.length).toBe(2)
  })

  it('retorna todas si no se especifica género', () => {
    const resultado = filtrarPorGenero(peliculasMock, null)
    expect(resultado.length).toBe(4)
  })
})