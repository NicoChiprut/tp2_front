import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../ui/LoadingSpinner'

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-cinema-black flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando..." />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return children
}