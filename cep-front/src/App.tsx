import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Navegacao } from './components/Navegacao'
import { ProtectedRoute } from './components/ProtectedRoute'
import './App.css'

const BuscaCep = lazy(() => import('./pages/BuscaCep').then(m => ({ default: m.BuscaCep })))
const Noticias = lazy(() => import('./pages/Noticias').then(m => ({ default: m.Noticias })))
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })))

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navegacao />
        <Suspense fallback={
          <div className="loading-page">
            <div className="spinner"></div>
            <p>Carregando página...</p>
          </div>
        }>
          <Routes>
            <Route path="/" element={<BuscaCep />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/noticias" 
              element={
                <ProtectedRoute>
                  <Noticias />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
