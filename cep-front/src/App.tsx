import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navegacao } from './components/Navegacao'
import './App.css'

const BuscaCep = lazy(() => import('./pages/BuscaCep').then(m => ({ default: m.BuscaCep })))
const Noticias = lazy(() => import('./pages/Noticias').then(m => ({ default: m.Noticias })))

function App() {
  return (
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
          <Route path="/noticias" element={<Noticias />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
