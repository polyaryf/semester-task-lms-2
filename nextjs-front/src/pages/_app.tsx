import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import { UserContextProvider } from '@/context/userContext'

import 'react-toastify/dist/ReactToastify.css'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider>
      <ToastContainer position='bottom-right' />
      <Component {...pageProps} />
    </UserContextProvider>
  )
}
