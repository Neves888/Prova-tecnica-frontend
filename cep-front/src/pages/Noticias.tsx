import { useState, useEffect } from 'react'
import axios from 'axios'
import './Noticias.css'

type Noticia = {
  id?: number
  titulo: string
  descricao: string
}

const API_URL = 'http://localhost:3001/noticias'

export function Noticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [editando, setEditando] = useState<number | null>(null)

  useEffect(() => {
    carregarNoticias()
  }, [])

  const carregarNoticias = async () => {
    setCarregando(true)
    setErro(null)
    try {
      const resp = await axios.get(API_URL)
      setNoticias(resp.data)
    } catch {
      setErro('Erro ao carregar notícias. Verifique se o backend está rodando.')
    } finally {
      setCarregando(false)
    }
  }

  const limparFormulario = () => {
    setTitulo('')
    setDescricao('')
    setEditando(null)
  }

  const salvarNoticia = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titulo.trim() || !descricao.trim()) {
      setErro('Título e descrição são obrigatórios.')
      return
    }

    setCarregando(true)
    setErro(null)
    try {
      if (editando) {
        await axios.put(`${API_URL}/${editando}`, { titulo, descricao })
      } else {
        await axios.post(API_URL, { titulo, descricao })
      }
      await carregarNoticias()
      limparFormulario()
    } catch {
      setErro(editando ? 'Erro ao atualizar notícia.' : 'Erro ao criar notícia.')
    } finally {
      setCarregando(false)
    }
  }

  const editarNoticia = (noticia: Noticia) => {
    setTitulo(noticia.titulo)
    setDescricao(noticia.descricao)
    setEditando(noticia.id || null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deletarNoticia = async (id: number) => {
    if (!confirm('Deseja realmente excluir esta notícia?')) return

    setCarregando(true)
    setErro(null)
    try {
      await axios.delete(`${API_URL}/${id}`)
      await carregarNoticias()
    } catch {
      setErro('Erro ao deletar notícia.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="container-noticias">
      <h2 className="titulo-noticias">Gerenciar Notícias</h2>

      <form className="form-noticias" onSubmit={salvarNoticia}>
        <h3 className="subtitulo">{editando ? 'Editar Notícia' : 'Nova Notícia'}</h3>
        
        <div className="campo">
          <label htmlFor="titulo" className="label-noticia">Título:</label>
          <input
            type="text"
            id="titulo"
            className="input-noticia"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Digite o título da notícia"
            disabled={carregando}
          />
        </div>

        <div className="campo">
          <label htmlFor="descricao" className="label-noticia">Descrição:</label>
          <textarea
            id="descricao"
            className="textarea-noticia"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Digite a descrição da notícia"
            rows={4}
            disabled={carregando}
          />
        </div>

        <div className="acoes-form">
          <button type="submit" className="btn-salvar" disabled={carregando}>
            {carregando ? 'Salvando...' : editando ? 'Atualizar' : 'Criar'}
          </button>
          {editando && (
            <button
              type="button"
              className="btn-cancelar"
              onClick={limparFormulario}
              disabled={carregando}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {erro && (
        <div className="erro-noticias" role="alert">
          {erro}
        </div>
      )}

      {carregando && !erro && (
        <div className="loader-noticias" aria-live="polite">
          Carregando...
        </div>
      )}

      <div className="lista-noticias">
        <h3 className="subtitulo">Lista de Notícias</h3>
        {noticias.length === 0 && !carregando && (
          <p className="vazio">Nenhuma notícia cadastrada.</p>
        )}
        {noticias.map((noticia) => (
          <div key={noticia.id} className="card-noticia">
            <h4 className="titulo-card">{noticia.titulo}</h4>
            <p className="descricao-card">{noticia.descricao}</p>
            <div className="acoes-card">
              <button
                className="btn-editar"
                onClick={() => editarNoticia(noticia)}
                disabled={carregando}
              >
                Editar
              </button>
              <button
                className="btn-deletar"
                onClick={() => deletarNoticia(noticia.id!)}
                disabled={carregando}
              >
                Deletar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
