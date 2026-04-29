import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import AuthGuard from './components/auth/AuthGuard'
import Navbar from './components/ui/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Catalog from './pages/Catalog'

function Layout({ children, showNav = true }) {
  return (
    <div className="min-h-screen bg-cinema-black">
      {showNav && <Navbar />}
      <main>{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout showNav={false}><Home /></Layout>} />
          <Route path="/login" element={<Layout showNav={false}><Login /></Layout>} />
          <Route path="/register" element={<Layout showNav={false}><Register /></Layout>} />
          <Route 
            path="/catalog" 
            element={
              <AuthGuard>
                <Layout><Catalog /></Layout>
              </AuthGuard>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error: { iconTheme: { primary: '#e8192c', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}