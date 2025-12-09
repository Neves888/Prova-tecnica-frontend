import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Navegacao.css'

export function Navegacao() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navegacao">
      <div className="nav-content">
        <h1 className="titulo-nav">Prova técnica frontend</h1>
        <div className="nav-info">
          <div className="links">
            <Link to="/" className="link-nav">Busca CEP</Link>
            <Link to="/noticias" className="link-nav">Notícias</Link>
          </div>
          {isAuthenticated && user && (
            <div className="user-info">
              <span className="user-name">👤 {user.nome}</span>
              <button onClick={handleLogout} className="btn-logout">
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
