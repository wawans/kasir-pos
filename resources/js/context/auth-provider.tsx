import { createContext, useCallback, useContext } from 'react'
import { useSessionStorage } from 'usehooks-ts'
import axios from '@/lib/axios'

export interface AuthContextType {
  user: App.Data.UserData | null
  isAuthenticated: boolean
  getUser: () => Promise<App.Data.UserData | null>
  logout: () => Promise<void>
  login: (
    email: string,
    password: string
  ) => Promise<{ data: App.Data.UserData }>
  register: (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ) => Promise<{ data: App.Data.UserData }>
  reset: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthKey =
  (import.meta.env.VITE_APP_URL || import.meta.env.APP_URL || 'Laravel') +
  '.auth.user'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useSessionStorage<App.Data.UserData | null>(
    AuthKey,
    null
  )

  const getCsrfToken = useCallback(async (): Promise<void> => {
    await axios.get('/sanctum/csrf-cookie', {
      withCredentials: true,
    })
  }, [])

  const getUser = async () => {
    try {
      const { data } = await axios.get('/api/auth/user')
      setUser(data)

      return data
    } catch {
      setUser(null)

      return null
    }
  }

  const logout = useCallback(async () => {
    // Get CSRF token first
    await getCsrfToken()

    // Small delay to ensure cookie is set
    await new Promise((resolve) => setTimeout(resolve, 100))

    return await axios.post('/logout').then(({ data }) => {
      setUser(null)

      return data
    })
  }, [getCsrfToken, setUser])

  const login = useCallback(
    async (email: string, password: string) => {
      // Get CSRF token first
      await getCsrfToken()

      // Small delay to ensure cookie is set
      await new Promise((resolve) => setTimeout(resolve, 100))

      return await axios
        .post('/login', { email: email, password: password })
        .then(({ data }) => {
          setUser(data.data)

          return data
        })
    },
    [getCsrfToken, setUser]
  )

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      passwordConfirmation: string
    ) => {
      // Get CSRF token first
      await getCsrfToken()

      // Small delay to ensure cookie is set
      await new Promise((resolve) => setTimeout(resolve, 100))

      return await axios
        .post('/register', {
          name: name,
          email: email,
          password: password,
          password_confirmation: passwordConfirmation,
        })
        .then(({ data }) => {
          setUser(data.data)

          return data
        })
    },
    [getCsrfToken, setUser]
  )

  const reset = useCallback(() => {
    setUser(null)
  }, [setUser])

  const value = {
    user: user,
    isAuthenticated: !!user,
    getUser,
    login,
    logout,
    register,
    reset,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
