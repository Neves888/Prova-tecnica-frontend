import { Link } from 'react-router-dom'
import './Navegacao.css'

export function Navegacao() {
  return (
    <nav className="navegacao">
      <div className="nav-content">
        <h1 className="titulo-nav">Prova técnica frontend</h1>
        <div className="links">
          <Link to="/" className="link-nav">Busca CEP</Link>
          <Link to="/noticias" className="link-nav">Notícias</Link>
        </div>
      </div>
    </nav>
  )
}
