import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { lightTheme } from '../themes'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { SWRConfig } from 'swr';

export default function App({ Component, pageProps }: AppProps) {
  return (

    //usamos SWR de forma global para realizar la configuracion para realizar peticones http similar a axios
    <SWRConfig
      value={{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      {/* colocamos el ThemeProvider de material UI, como theme usamos los creados en la carpeta themes */}
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </SWRConfig>

  )




}
