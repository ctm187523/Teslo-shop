import Head from "next/head"
import { FC, ReactElement } from "react";
import { Navbar, SideMenu } from "../ui";


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

        {/* usamos la etiqueta nav de html y dentro importamos el Navbar de ui/Navbar */}
        <nav>
            <Navbar />
        </nav>

          {/*  importamos el Navbar de ui/Navbar */}
        <SideMenu />

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
