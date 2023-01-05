import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { lightTheme } from '../themes'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { SWRConfig } from 'swr';
import { AuthProvider, CartProvider, UiProvider } from '../context';
import { SessionProvider } from "next-auth/react";

//importamos para usar paypal --> yarn add @paypal/react-paypal-js
import { PayPalScriptProvider } from "@paypal/react-paypal-js";


export default function App({ Component, pageProps }: AppProps) {
  return (

    //En la raiz ponemos SessionProvider de nextAuth para que todos los componentes puedan
    //leer informacion de la sesion ver video 299
    <SessionProvider>
      {/*usamos este provider para el uso de paypal ver video 337, en option ponemos la clave publica
      ubuicada en el archivo .env*/}
      <PayPalScriptProvider options={{ 'client-id':process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''}}>
        {/* usamos SWR de forma global para realizar la configuracion para realizar peticones http similar a axios */}
        <SWRConfig
          value={{
            fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
          }}
        >
          {/* usamos el contexto del AuthProvider para manejar el estado de la autenticacion */}
          <AuthProvider>
            {/* usamos el context CartProvider para manejar el estado del carrito */}
            <CartProvider>
              {/* usamos el context UiProvider de context/ui/UiProvider */}
              <UiProvider>
                {/* colocamos el ThemeProvider de material UI, como theme usamos los creados en la carpeta themes */}
                <ThemeProvider theme={lightTheme}>
                  <CssBaseline />
                  <Component {...pageProps} />
                </ThemeProvider>
              </UiProvider>
            </CartProvider>
          </AuthProvider>
        </SWRConfig>
      </PayPalScriptProvider>
    </SessionProvider>
  )
}
