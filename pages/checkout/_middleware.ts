

import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { jwt } from "../../utils";


//usamos un middleware se pone siempre asi _middleware con el guion bajo
//para que Next lo reconozca, el middleware esta ubicado en el directorio checkout
//y esto hace que antes que se ejecuten los archivos address.tsx y summary.tsx
//se ejecute el middleware y si no cumple las condiciones que pone el middleware
//no se ejecutan los demas archivos
//este middleware lo usamos para que si el usuario no esta autenticado no ejecute los
//archivos que le preceden


//como argumentos tiene la request(req) y un evento, los tipamos
export async function middleware ( req: NextRequest, ev:NextFetchEvent) {

    //obtenemos el token de las cookies con el argumento req(request)
    const { token = '' } = req.cookies;

    //utilizamos el Objeto Response de Javascript para modificar la respuesta ver video 286 minuto 4:30 aprox
    //lo comentamos es solo como ejemplo como modifica la pagina
    //return new Response( 'Token: ' +token);

    try {
        
        await jwt.isValidToken( token ); //evaluamos el token si es valido
        return NextResponse.next(); //si es valido pasamos a la siguiente pagina
    } catch (error) {

        //comentamos lo de abajo aunque funcionaria porque lo haremos usando Next que es lo recomendado
        //return Response.redirect('/auth/login');

        //obtenemos la query de la ultima pagina visitada
        const requestPage = req.page.name;
        //si el token no es valido sacamos al usuario a la url /auth/login, mandandole la query de la ultima pagina visitada
        return NextResponse.redirect(`/auth/login?p=${ requestPage }`);
        
    }

}