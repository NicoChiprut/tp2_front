import { useState, useRef } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useMovies } from '../hooks/useMovies'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function Profile() {
  const { user } = useAuth()
  const { profile, loading, uploading, updateProfile, uploadAvatar } = useProfile()
  const { stats } = useMovies()
  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState('')
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  const handleEditStart = () => {
    setUsername(profile?.username || '')
    setEditing(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!username.trim()) return
    setSaving(true)
    try {
      await updateProfile({ username: username.trim() })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) await uploadAvatar(file)
    e.target.value = ''
  }

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner size="lg" text="Cargando perfil..." />
    </div>
  )

  const displayName = profile?.username || user?.email?.split('@')[0]

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <h1 className="font-display text-5xl text-white tracking-widest mb-10">MI PERFIL</h1>

      {/* Avatar + info */}
      <div className="bg-cinema-gray border border-white/10 rounded-2xl p-8 space-y-8">
        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-cinema-red/20 border-2 border-cinema-red/30 flex items-center justify-center">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-display text-4xl text-cinema-red">
                  {displayName?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              {uploading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <span className="text-white text-xs font-body">Cambiar</span>
              }
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div>
            <p className="font-display text-3xl text-white tracking-wide">{displayName}</p>
            <p className="text-white/40 font-body text-sm mt-1">{user?.email}</p>
            <p className="text-white/20 font-body text-xs mt-1">
              Miembro desde {new Date(user?.created_at).toLocaleDateString('es-AR', { year: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>

        {/* Edit username */}
        {editing ? (
          <form onSubmit={handleSave} className="space-y-3">
            <label className="block text-xs text-white/50 font-body uppercase tracking-wider">Nombre de usuario</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                maxLength={30}
                className="flex-1 bg-black/40 border border-white/20 text-white font-body text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-cinema-red/60 transition-colors"
              />
              <button
                type="submit"
                disabled={saving}
                className="bg-cinema-red hover:bg-red-700 disabled:opacity-50 text-white font-body text-sm px-5 py-2.5 rounded-lg transition-colors"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="bg-white/5 hover:bg-white/10 text-white/60 font-body text-sm px-4 py-2.5 rounded-lg transition-colors border border-white/10"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={handleEditStart}
            className="text-sm font-body text-white/40 hover:text-white/70 transition-colors border border-white/10 hover:border-white/20 px-4 py-2 rounded-lg"
          >
            ✏️ Editar nombre de usuario
          </button>
        )}

        {/* Stats */}
        <div className="border-t border-white/5 pt-6">
          <p className="text-xs text-white/30 font-body uppercase tracking-widest mb-4">Estadísticas</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total', value: stats.total, color: 'text-white' },
              { label: 'Vistas', value: stats.watched, color: 'text-green-400' },
              { label: 'Promedio', value: stats.avgRating > 0 ? `★ ${stats.avgRating}` : '—', color: 'text-cinema-gold' },
            ].map(s => (
              <div key={s.label} className="bg-black/30 rounded-xl p-4 text-center">
                <p className={`font-display text-3xl ${s.color}`}>{s.value}</p>
                <p className="text-white/30 font-body text-xs uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}