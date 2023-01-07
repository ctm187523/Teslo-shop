

import { NextFetchEvent, NextRequest, NextResponse } from "next/server";


import { getToken } from 'next-auth/jwt'


//usamos un middleware se pone siempre asi _middleware con el guion bajo
//para que Next lo reconozca, el middleware esta ubicado en el directorio checkout
//y esto hace que antes que se ejecuten los archivos address.tsx y summary.tsx
//se ejecute el middleware y si no cumple las condiciones que pone el middleware
//no se ejecutan los demas archivos
//este middleware lo usamos para que si el usuario no esta autenticado no ejecute los
//archivos que le preceden


//como argumentos tiene la request(req) y un evento, los tipamos
export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {


    //COMENTAMOS TODO LO DE ABAJO PORQUE USAMOS NEXT AUTH


    //obtenemos el token de las cookies con el argumento req(request)
    //const { token = '' } = req.cookies;

    //utilizamos el Objeto Response de Javascript para modificar la respuesta ver video 286 minuto 4:30 aprox
    //lo comentamos es solo como ejemplo como modifica la pagina
    //return new Response( 'Token: ' +token);


    // try {

    //     await jwt.isValidToken( token ); //evaluamos el token si es valido
    //     return NextResponse.next(); //si es valido pasamos a la siguiente pagina
    // } catch (error) {

    //     //comentamos lo de abajo aunque funcionaria porque lo haremos usando Next que es lo recomendado
    //     //return Response.redirect('/auth/login');

    //     //obtenemos la query de la ultima pagina visitada
    //     const requestPage = req.page.name;
    //     //si el token no es valido sacamos al usuario a la url /auth/login, mandandole la query de la ultima pagina visitada
    //     return NextResponse.redirect(`/auth/login?p=${ requestPage }`);

    // }

    //USAMOS NEXT AUTH, usamos el metodo importado arriba getToken de next auth
    //como argumentos tenemos la request y del archivo .env la clave secreta
    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    //console.log( {session})

    //si no existe una session, el usuario no esta autenticado enviamos un mensaje 
    if (!session) {
        return new Response(JSON.stringify({ message: 'No autorizado' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    //comprobamos que el usuario sea uno de los roles validos
    const validRoles = ['admin', 'super-user', 'SEO'];

    //comprobamos el rol del usuario autenticado en la session
    //si no existe lo sacamos al home
    if (!validRoles.includes(session.user.role)) {
        return new Response(JSON.stringify({ message: 'No autorizado' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    //si es un role permitido dejamos que se ejecuten las paginas que preceden al middleware

    //si tenemos una session redirigimos a las paginas que le preceden al middleware
    return NextResponse.next();

}