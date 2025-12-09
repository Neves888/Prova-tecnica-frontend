import { useState } from 'react'
import axios from 'axios'
import './App.css'

type Endereco = {
  cep?: string
  logradouro?: string
  complemento?: string
  bairro?: string
  localidade?: string
  uf?: string
}

function App() {
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
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          setErro('Tempo esgotado. Tente novamente.')
        } else {
          setErro('Erro ao buscar. Verifique sua conexão.')
        }
      } else if (err instanceof Error) {
        setErro('Erro ao buscar. Verifique sua conexão.')
      } else {
        setErro('Erro ao buscar. Verifique sua conexão.')
      }
      setEndereco(null)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="app-root">
      <header>
        <h1>Buscador de Endereço por CEP</h1>
        <p className="sub">Use um CEP com 8 dígitos (ex: 01001000)</p>
      </header>

      <main>
        <form className="form-cep" onSubmit={buscarCep} aria-label="form-busca-cep">
          <label htmlFor="cep">CEP</label>
          <div className="input-row">
            <input
              id="cep"
              name="cep"
              inputMode="numeric"
              value={cep}
              onChange={(ev) => tratarEntrada(ev.target.value)}
              placeholder="Digite somente números"
              aria-describedby="erro-cep"
            />
            <button type="submit" disabled={carregando} className="btn-buscar">
              {carregando ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
          {erro && (
            <p id="erro-cep" className="mensagem erro" role="alert">
              {erro}
            </p>
          )}
        </form>

        <section className="resultado">
          {carregando && <div className="loader" aria-hidden="true" />}

          {endereco && (
            <div className="card-endereco">
              <h2>Endereço encontrado</h2>
              <p>
                <strong>CEP:</strong> {endereco.cep}
              </p>
              <p>
                <strong>Logradouro:</strong> {endereco.logradouro || '—'}
              </p>
              <p>
                <strong>Complemento:</strong> {endereco.complemento || '—'}
              </p>
              <p>
                <strong>Bairro:</strong> {endereco.bairro || '—'}
              </p>
              <p>
                <strong>Cidade:</strong> {endereco.localidade || '—'}
              </p>
              <p>
                <strong>UF:</strong> {endereco.uf || '—'}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
