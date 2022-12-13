import Head from "next/head"
import { FC, ReactElement } from "react";
import { Navbar } from "../ui";


interface Props {
    title: string;
    pageDescription: string;
    imageFullUrl?: string;
    children:ReactElement | ReactElement[], 
}

export const ShopLayout:FC<Props> = ( { children, title, pageDescription, imageFullUrl}) => {
  return (
    <>
        <Head>
            <title> { title } </title>
            {/* metatags para mejorar la indexacion */}
            <meta name="description" content={ pageDescription }/>

            {/* para compartir en redes sociales */}
            <meta name="og:title" content={ title }/>
            <meta name="og:description" content={ pageDescription }/>

            {/* si tenemos el imageFulllUrl usamos la siguiente metatag */}
            {
                imageFullUrl && (
                    <meta name="og:image" content={ imageFullUrl }/>
                )
            }
        </Head>

        <nav>
            <Navbar />
        </nav>

        <main style={{
            margin: '80px auto',
            maxWidth: '1440px',
            padding: '0px 30px'
        }}>
            { children }
        </main>

        <footer>
            
        </footer>
    </>
  )
}
