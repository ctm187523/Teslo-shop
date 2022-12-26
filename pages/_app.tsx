import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { lightTheme } from '../themes'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { SWRConfig } from 'swr';
import { CartProvider, UiProvider } from '../context';


export default function App({ Component, pageProps }: AppProps) {
  return (

    //usamos SWR de forma global para realizar la configuracion para realizar peticones http similar a axios
    <SWRConfig
      value={{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      {/* usamos el context CartProvider de context/ui/UiProvider */}
      <CartProvider>
        {/* usamos el context UiProvider de context/cart/CartProvider */}
        <UiProvider>
          {/* colocamos el ThemeProvider de material UI, como theme usamos los creados en la carpeta themes */}
          <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </UiProvider>
      </CartProvider>
    </SWRConfig>

  )
}
