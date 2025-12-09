import { useState } from 'react'
import axios from 'axios'
import './BuscaCep.css'

type Endereco = {
  cep?: string
  logradouro?: string
  complemento?: string
  bairro?: string
  localidade?: string
  uf?: string
}

export function BuscaCep() {
  const [cep, setCep] = useState('')
  const [endereco, setEndereco] = useState<Endereco | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const limparEstado = () => {
    setEndereco(null)
    setErro(null)
  }

  const tratarEntrada = (valor: string) => {
    const numeros = valor.replace(/\D/g, '')
    setCep(numeros.slice(0, 8))
  }

  const buscarCep = async (e?: React.FormEvent) => {
    e?.preventDefault()
    limparEstado()

    if (cep.length !== 8) {
      setErro('CEP deve conter 8 números.')
      return
    }

    setCarregando(true)
    try {
      const url = `https://viacep.com.br/ws/${cep}/json/`
      const resp = await axios.get(url, { timeout: 8000 })
      const data = resp.data
      if (data.erro) {
        setErro('CEP não encontrado.')
        setEndereco(null)
      } else {
        setEndereco({
          cep: data.cep,
          logradouro: data.logradouro,
          complemento: data.complemento,
          bairro: data.bairro,
          localidade: data.localidade,
          uf: data.uf,
        })
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
        setErro('Tempo esgotado. Tente novamente.')
      } else {
        setErro('Erro ao buscar CEP. Verifique sua conexão.')
      }
    } finally {
      setCarregando(false)
    }
  }

  const formatarCep = (cep: string) => {
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2')
  }

  return (
    <div className="container-cep">
      <h2 className="titulo">Busca de CEP</h2>

      <form className="form-cep" onSubmit={buscarCep}>
        <label htmlFor="cep" className="label-cep">
          Digite o CEP (somente números):
        </label>
        <input
          type="text"
          id="cep"
          className="input-cep"
          value={cep}
          onChange={(e) => tratarEntrada(e.target.value)}
          placeholder="00000000"
          maxLength={8}
          disabled={carregando}
        />
        <button
          type="submit"
          className="btn-buscar"
          disabled={carregando || cep.length !== 8}
        >
          {carregando ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {carregando && (
        <div className="loader" aria-live="polite" aria-busy="true">
          Carregando...
        </div>
      )}

      {erro && (
        <div className="erro" role="alert" aria-live="assertive">
          {erro}
        </div>
      )}

      {endereco && (
        <div className="card-endereco" aria-live="polite">
          <h3 className="titulo-resultado">Endereço Encontrado</h3>
          <p><strong>CEP:</strong> {formatarCep(endereco.cep || '')}</p>
          <p><strong>Logradouro:</strong> {endereco.logradouro || 'N/A'}</p>
          {endereco.complemento && <p><strong>Complemento:</strong> {endereco.complemento}</p>}
          <p><strong>Bairro:</strong> {endereco.bairro || 'N/A'}</p>
          <p><strong>Cidade:</strong> {endereco.localidade || 'N/A'}</p>
          <p><strong>UF:</strong> {endereco.uf || 'N/A'}</p>
        </div>
      )}
    </div>
  )
}
