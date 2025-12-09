import { useContext } from 'react'
import { AuthContext, type AuthContextType } from '../contexts/AuthContextCreate'

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }

  return context
}
