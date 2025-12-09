import { createContext } from 'react'

type User = {
  id: number
  nome: string
  email: string
}

export type AuthContextType = {
  user: User | null
  token: string | null
  login: (email: string, senha: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
