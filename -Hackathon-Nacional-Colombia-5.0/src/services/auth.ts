export interface User {
  email: string
  name: string
  role: string
}

const STORAGE_KEY = 'auditoria_secop_user'

export const login = async (email: string, password: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  // Simulación de autenticación - en producción usar backend real
  if (email && password && password.length >= 6) {
    const user: User = { email, name: 'Analista SECOP', role: 'auditor' }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    return user
  }
  throw new Error('Correo o contraseña inválidos')
}

export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) {
    try {
      return JSON.parse(data) as User
    } catch {
      return null
    }
  }
  return null
}