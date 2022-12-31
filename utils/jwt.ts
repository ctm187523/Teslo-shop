
//instalamos json web token(jwt) con --> yarn add jsonwebtoken
//para el tipado con typescript --> yarn add -D @types/jsonwebtoken   usamos el -D es para indicar que es de desarrolo no de produccion 
import jwt from 'jsonwebtoken'

//funcion para generar jsonwebtoken, jwt no trabaja con promesas trabaja con callbacks
//haremos una conversion para que trabaje con promesas
export const signToken = (_id: string, email: string) => {

    //nos aseguramos que la variable para el jwt este creada
    if (!process.env.JWT_SECRET_SEED) {
        throw new Error('No hay semilla de JWT - Revisar variables de entorno')
    }

    //creamos un nuevo jsonwebtoken, el jwt consta de header donde se define el tipo,
    //el payload donde se define la data y sign, la firma encriptada
    //todo el jwt regresa un string
    return jwt.sign(
        //ponemos primeramente el payload, la data, no poner datos sensibles como tarjetas de credito, password, etc
        { _id, email },

        //ponemos la semilla que es la palabra clave almacenada en la variable de entorno
        //esta palabra se puede ir cambiando para cambiar la contraseña
        process.env.JWT_SECRET_SEED,

        //opciones, como opciones ponemos que expire el token cada 30 dias
        { expiresIn: '30d' }

    )
}

//funcion para ver si un token es valido recibe el token como string y devuelve una Promesa
export const isValidToken = (token: string): Promise<string> => {

    //nos aseguramos que la variable para el jwt este creado
    if (!process.env.JWT_SECRET_SEED) {
        throw new Error('No hay semilla de JWT - Revisar variables de entorno')
    }

    //comprovamos si el token es valido si tiene menos de 10 caracteres no es valido ya que lo token tienen siempre mas caracteres
    if( token.length <= 10 ) {
        return Promise.reject('JWT no es valiodo'); //retornamos una promesa que es lo que pide la funcion
    }

    return new Promise((resolve, reject) => {
        try {
            //para validar mandamos el token a validar y la clave de las variables
            //y despues un callback para mostrar el error si sale mal y si sale bien devolvemos
            //el id del payload del propio JWT
            jwt.verify(token, process.env.JWT_SECRET_SEED || '', (err, payload) => {

                if (err) return reject('JWT no es válido'); //no es valido reject

                const { _id } = payload as { _id: string };

                resolve(_id); //es valido resolve, manda el _id
            })
        } catch (error) {
            reject('JWT no es válido');
        }
    })
}