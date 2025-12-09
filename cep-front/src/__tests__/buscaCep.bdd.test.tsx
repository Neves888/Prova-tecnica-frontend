import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import axios from 'axios'
import App from '../../src/App'

vi.mock('axios')

describe('Busca de Endereço por CEP', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Dado um CEP válido de Brasília, quando eu buscar, então devo ver o endereço retornado', async () => {
    const cepMock = '70040902'
    const resposta = {
      data: {
        cep: '70040-902',
        logradouro: 'SBN Quadra 1 Bloco A',
        complemento: '',
        bairro: 'Asa Norte',
        localidade: 'Brasília',
        uf: 'DF'
      }
    }

    vi.mocked(axios.get).mockResolvedValue(resposta)

    render(<App />)

    const input = screen.getByPlaceholderText(/Digite somente números/i)
    const botao = screen.getByRole('button', { name: /buscar/i })

    fireEvent.change(input, { target: { value: cepMock } })
    fireEvent.click(botao)

    await waitFor(() => expect(axios.get).toHaveBeenCalled())

    expect(await screen.findByText(/Endereço encontrado/i)).toBeInTheDocument()
    expect(screen.getByText(/SBN Quadra 1 Bloco A/)).toBeInTheDocument()
    expect(screen.getByText(/Brasília/)).toBeInTheDocument()
  })

  it('Dado um CEP inválido, quando eu buscar, então devo ver mensagem de erro', async () => {
    render(<App />)

    const input = screen.getByPlaceholderText(/Digite somente números/i)
    const botao = screen.getByRole('button', { name: /buscar/i })

    fireEvent.change(input, { target: { value: '123' } })
    fireEvent.click(botao)

    expect(await screen.findByRole('alert')).toHaveTextContent(/CEP deve conter 8 números\./i)
  })
})
