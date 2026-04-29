import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export function useMovies() {
  const { user } = useAuth()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, watched: 0, avgRating: 0 })

  const fetchMovies = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setMovies(data || [])
      const watched = data?.filter(m => m.watched).length || 0
      const rated = data?.filter(m => m.rating) || []
      const avg = rated.length
        ? (rated.reduce((acc, m) => acc + parseFloat(m.rating), 0) / rated.length).toFixed(1)
        : 0
      setStats({ total: data?.length || 0, watched, avgRating: avg })
    } catch (err) {
      toast.error('Error al cargar las películas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchMovies() }, [fetchMovies])

  const addMovie = async (movieData) => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .insert([{ ...movieData, user_id: user.id }])
        .select()
        .single()
      if (error) throw error
      setMovies(prev => [data, ...prev])
      setStats(prev => ({ ...prev, total: prev.total + 1 }))
      toast.success('Película agregada al catálogo 🎬')
      return data
    } catch (err) {
      toast.error('Error al agregar la película')
      throw err
    }
  }

  const updateMovie = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()
      if (error) throw error
      setMovies(prev => prev.map(m => m.id === id ? data : m))
      toast.success( 'Película actualizada ✓' )
      return data
    } catch (err) {
      toast.error('Error al actualizar la película')
      throw err
    }
  }

  const deleteMovie = async (id) => {
    try {
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
      if (error) throw error
      setMovies(prev => prev.filter(m => m.id !== id))
      setStats(prev => ({ ...prev, total: prev.total - 1 }))
      toast.success('Película eliminada')
    } catch (err) {
      toast.error('Error al eliminar la película')
      throw err
    }
  }

  const toggleWatched = async (id, currentWatched) => {
    await updateMovie(id, { watched: !currentWatched })
  }

  return { movies, loading, stats, addMovie, updateMovie, deleteMovie, toggleWatched, refetch: fetchMovies }
}