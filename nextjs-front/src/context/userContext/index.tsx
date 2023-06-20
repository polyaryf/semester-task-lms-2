import { useRouter } from 'next/router'
import { AxiosRequestConfig } from 'axios'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { UserType } from '@/types'

const emptyUser: UserType = {
  token: '',
  role: '',
  userId: '',
  id: '',
  login: '',
  name: '',
  telegramAlias: '',
}

type CTX = {
  user: UserType
  setUser: (user: UserType) => void
  getUserAuthCfg: () => AxiosRequestConfig
  exitUser: () => void
}

const USER_PERSIST_TOKEN = 'dasfasdfgsag'

const startCTX = {
  user: emptyUser,
  getUserAuthCfg: () => ({}),
  setUser: (u: UserType) => {},
  exitUser: () => {},
}

const userContext = createContext<CTX>(startCTX)
export const useUserContext = () => useContext(userContext)

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [user, setUser] = useState(emptyUser)

  const providerSetUser = (user: UserType) => {
    localStorage.setItem(USER_PERSIST_TOKEN, JSON.stringify(user))
    setUser(user)
  }

  const exitUser = () => {
    localStorage.removeItem(USER_PERSIST_TOKEN)
    setUser(emptyUser)
    router.push('/')
  }

  useEffect(() => {
    const savedUser = localStorage.getItem(USER_PERSIST_TOKEN)
    if (savedUser) {
      setUser(JSON.parse(savedUser) as UserType)
    }
    if (!savedUser && !user.token) {
      router.push('/')
    }
  }, [])

  const getUserAuthCfg = (): AxiosRequestConfig => {
    if (user.token) {
      return {
        headers: {
          Authorization: user.token,
        },
      }
    }
    return {}
  }

  return (
    <userContext.Provider
      value={{
        user,
        exitUser,
        setUser: providerSetUser,
        getUserAuthCfg: getUserAuthCfg,
      }}
    >
      {children}
    </userContext.Provider>
  )
}
