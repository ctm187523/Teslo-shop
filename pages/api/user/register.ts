

import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../../models';
import { db } from '../../../database';
import bcrypt from 'bcryptjs';
import { jwt, validations } from '../../../utils';

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
            return registerUser(req, res)
    
        default:
            res.status(400).json({
                message: 'Bad request'
            })
    }
}

const registerUser = async( req: NextApiRequest, res: NextApiResponse<Data>) => {

    //recibimos el email y el password de la request
    const { name='', email = '', password = ''} = req.body as { email:string, password: string, name: string};

    
    //validaciones
    if(password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe de ser de 6 caracteres o más'})
    }

    if( name.length < 2 ){
        return res.status(400).json({ message: 'El name debe de tener mas de 2 caracteres'})
    }

    //validar email usando las funcion de utils/validations si lo cumple retorna un correo permitido
    //lo negaremos para los correos que no cumplan la estructura de un email
    if( !validations.isValidEmail(email) ){
        
        return res.status(400).json({ message: 'El correo tiene el formato correcto'})
    }

    await db.connect();

    //buscamos en la base de datos si hay algun usaurio con el email recibido de la request
    //en la constante user recibimos todo el contenido del usuario name, email,password,etc
    const user = await User.findOne({ email: email}); //podriamos dejar simplemente email
    
    //si existe el usuario mandamos un mensaje de error, ya que ya esta registrado
    if( user ) {
        await db.disconnect();
        return res.status(400).json({ message: 'Este correo ya esta registrado'})
    }

    //creamos un nuevo usuario usando el User de los modelos
    const newUser = new User({
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync( password ), //encriptamos el password+
        role: 'client',
        name: name,
    })

    try {
        //creamos un nuevo usuario 
        await newUser.save({ validateBeforeSave: true});
        await db.disconnect();
    } catch (error) {
        await db.disconnect();
        console.log(error);
        return res.status(500).json({
            message: 'revisar logs del servidor'
        })
    }

    //si todo es correcto regresamos un objeto con la informacion siguiente
    const { _id, role} = newUser;

    //generamos el token del archivo donde se crean los tokens utils/jwt
    //pasamos por parametros los valores requeridos para construir el payload, la data
    const token = jwt.signToken( _id, email );

    return res.status(200).json({
        token,
        user:{
            email, 
            role,
            name,
        }
    })
    
}