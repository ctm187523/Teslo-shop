

import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../../models';
import { db } from '../../../database';
import bcrypt from 'bcryptjs';
import { jwt } from '../../../utils';

type Data = 
| { message: string}
| {
    token: string;
    user: {
        email: string;
        name: string;
        role: string;
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return loginUser(req, res)
    
        default:
            res.status(400).json({
                message: 'Bad request'
            })
    }
}

const loginUser = async( req: NextApiRequest, res: NextApiResponse<Data>) => {

    //recibimos el email y el password de la request
    const { email = '', password = ''} = req.body;

    await db.connect();

    //buscamos en la base de datos si hay algun usaurio con el email recibido de la request
    //en la constante user recibimos todo el contenido del usuario name, email,password,etc
    const user = await User.findOne({ email: email}); //podriamos dejar simplemente email
    await db.disconnect();
    
    //si no existe el usuario mandamos un mensaje de error
    if( ! user ) {
        return res.status(400).json({ message: 'Correo o contraseña no válidos - EMAIL'})
    }

    //hemos encontrado el usuario ahora miramos que la contraseña sea correcta usando el paquete
    //instalado bycript para confirmar que la contraseña introducida sea la correcta ya que en la 
    //base de datos esta encriptada de una sola direccion

    //con bycript.compareSync vemos si un password hace equivalencia a otro password
    //comparamos el password introducido por el usuario con el recibido de la base de datos
    //el signo de admiracion final es para indicar que si viene el password esta definido
    //con el signo de principio negamos decimos que si no es igual ejecute el codigo entre llaves
    if ( !bcrypt.compareSync( password, user.password!)){

        return res.status(400).json({ message: 'Correo o contraseña no válidos - PASSWORD'})     
    }

    //si todo es correcto regresamos un objeto con la informacion siguiente
    const { role, name, _id} = user;

    //generamos el token del archivo donde se crean los tokens utils/jwt
    //pasamos por parametros los valores requeridos para construir el payload, la data
    const token = jwt.signToken( _id, email );

    return res.status(200).json({
        token,
        user:{
            email, role, name
        }
    })
    
}