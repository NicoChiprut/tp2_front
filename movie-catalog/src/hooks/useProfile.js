import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const fetchProfile = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      // Si no existe perfil aún, crearlo
      if (!data) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: user.id,
            username: user.user_metadata?.username || user.email?.split('@')[0]
          }])
          .select()
          .single()
        if (insertError) throw insertError
        setProfile(newProfile)
      } else {
        setProfile(data)
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single()
      if (error) throw error
      setProfile(data)

      // Sincronizar username en auth metadata si cambió
      if (updates.username) {
        await supabase.auth.updateUser({ data: { username: updates.username } })
      }

      toast.success('Perfil actualizado ✓')
      return data
    } catch (err) {
      toast.error('Error al actualizar el perfil')
      throw err
    }
  }

  const uploadAvatar = async (file) => {
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen no puede superar 2MB')
      return
    }

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${user.id}/avatar.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Añadir timestamp para evitar cache
      const avatarUrl = `${publicUrl}?t=${Date.now()}`
      await updateProfile({ avatar_url: avatarUrl })
      toast.success('Foto de perfil actualizada 🎬')
      return avatarUrl
    } catch (err) {
      toast.error('Error al subir la imagen')
      throw err
    } finally {
      setUploading(false)
    }
  }

  return { profile, loading, uploading, updateProfile, uploadAvatar, refetch: fetchProfile }
}