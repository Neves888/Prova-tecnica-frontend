import { useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthContextCreate'

type User = {
  id: number
  nome: string
  email: string
}

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token')
  })
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, senha: string): Promise<boolean> => {
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 800))

    if (email === 'admin@teste.com' && senha === '123456') {
      const fakeToken = btoa(`${email}:${Date.now()}:${Math.random()}`)
      const userData = {
        id: 1,
        nome: 'Administrador',
        email: email
      }

      setToken(fakeToken)
      setUser(userData)
      localStorage.setItem('token', fakeToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
