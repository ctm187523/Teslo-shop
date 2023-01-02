
//hemos instalado nextauth con --> yarn add next-auth
//hemos creado esta carpeta en pages con este archivo [...nextauth].ts tal como pide 
//en la web de nextauth, para que qualquier url(peticion) que venga en el la carpeta de auth
//caiga en este archivo  [...nextauth].ts unicamente hemos cambiado js por ts para trabajar con typescript
//web nextauth --> https://next-auth.js.org/getting-started/example
//VER VIDEO 297 Y 298 Y SIGUIENTES PARA CONFIGURACION

import NextAuth from "next-auth"
//importacion para google
import GoogleProvider from "next-auth/providers/google";
//importacion para usar github
import GithubProvider from "next-auth/providers/github"
//importacion para usar nuestro propio sistema de autenticacion, el que hemos realizado en el proyecto en videos anteriores
import Credentials from 'next-auth/providers/credentials';
import { dbUsers } from "../../../database";

//creamos este codigo para que no salga error en session.accessToken  = token.accessToken linea 83
//si no realizamos esta declaracion no reconoce accesToken el objeto session
//ver modificaciones en el Preguntas y Respuestas del curso del video 301 (La propiedad 'accessToken' no existe en el tipo 'Session'. - HELP!)
declare module "next-auth" {
    interface Session {
      accessToken?: string;
    }
  }



export default NextAuth({

    // Configuracion de Providers, salen en el mismo orden que los declaramaos
    providers: [
       
        //usamos Credentiasl importado en los import de arriba, para crear nuestro login personalizado y no usar un provider
        Credentials({
            name: 'Custom login',
            credentials: {
                email: { label: 'Correo:', type: 'email', placeholder: 'correo@google.com' },
                password: { label: 'Contraseña:', type: 'password', placeholder: 'Contraseña' },
            },
            async authorize(credentials) {
                //console.log({ credentials })
                //return { name: 'Juan', correo: 'juan@google.com', role:'admin'} as any

                //usamos el archivo creado en database/dbUsers.ts para hacer la peticion a la base de datos de si existe
                // un usuario con el pasword y el email recibido y sacado de las credentials
                return await dbUsers.ckeckUserEmailPassword( credentials!.email, credentials!.password) as any
            }
        }),

        //Provider de Github
        GithubProvider({
            //variables configuradas ver video 298 y alojadas en .env he tenido que poner as strig en
            //las variables porque si no me daba error
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
          }),
    ],

    //Callbacks
    jwt :{
        // secret: process.env.JWT_SECRET_SEED, //deprecated
    },

    //configuramos la duracion de la sesion
    session: {
        maxAge: 2592000, //indicamos que la session durara 30 dias
        strategy: 'jwt',
        updateAge: 86400 //indicamos que se actualize cada dia
    },

    //Custom pages, configuramos que usaremos el login personalizado
    //indicando las urls
    pages:{
        signIn: '/auth/login',
        newUser: '/auth/register'
    },


    //Callbacks, para indicar como firmar en JWT, por defecto nextauth usa JWT 
    //tenemos que definir que data se graba en los tokens, etc
    callbacks: {

        async jwt( { token, account, user}) {

           // console.log({ token, account, user})
            
           //comprobamos si tiene una cuenta
           if ( account ) {
                token.accessToken = account.access_token;

                switch (account.type) {

                    //si el tipo es oauth quiere decir que el usaurio se esta autenticando a traves de una red social
                    case 'oauth':

                        //crear usuario o verificar si existe en mi base de datos usamos el metodo creado en database/dbUser
                        // le pasamos por argumentos el email y el name del user de arriba de los parametros obtenidos de la 
                        //autenticacion del usuario si no vienen devolvemos un string vacio
                        //finalmente establecemos el token
                        token.user = await dbUsers.oAuthToDbUser( user?.email || '', user?.name || '');
                        break;
                        
                    //si es credentials quiere decir que no se esta auntenticando a traves de una red social
                    case 'credentials':
                        token.user = user; //establecemos el token en el usuario
                        break;
                
                    default:
                        break;
                }
           }
            return token; 
        },

        async session({ session, token, user}) {
           // console.log({ token, session, user})

           //pasamos el JWT a la session
           session.accessToken  = token.accessToken as any
           
           //pasamos el usuario a la session
           session.user = token.user as any;

            return session; 
        }
    }

});






