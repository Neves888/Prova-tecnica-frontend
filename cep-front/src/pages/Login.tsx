import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Login.css'

export function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const message = location.state?.message

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)

    if (!email || !senha) {
      setErro('Preencha email e senha.')
      return
    }

    const sucesso = await login(email, senha)

    if (sucesso) {
      navigate('/noticias')
    } else {
      setErro('Email ou senha inválidos.')
    }
  }

  return (
    <div className="container-login">
      <div className="card-login">
        <h2 className="titulo-login">Login</h2>
        <p className="subtitulo-login">Acesse o sistema de notícias</p>

        {message && (
          <div className="mensagem-info">
            {message}
          </div>
        )}

        <form className="form-login" onSubmit={handleSubmit}>
          <div className="campo-login">
            <label htmlFor="email" className="label-login">Email:</label>
            <input
              type="email"
              id="email"
              className="input-login"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              disabled={isLoading}
            />
          </div>

          <div className="campo-login">
            <label htmlFor="senha" className="label-login">Senha:</label>
            <input
              type="password"
              id="senha"
              className="input-login"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••"
              disabled={isLoading}
            />
          </div>

          {erro && (
            <div className="erro-login" role="alert">
              {erro}
            </div>
          )}

          <button type="submit" className="btn-login" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
