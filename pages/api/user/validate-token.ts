

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { User } from '../../../models';
import { jwt } from '../../../utils';

type Data =
    | { message: string }
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
        case 'GET':
            return checkJWT(req, res)

        default:
            res.status(400).json({
                message: 'Bad request'
            })
    }
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    //recibimos el token de las cookies, ya que cada peticion (GET,POST,DELETE)manda las cookies
    const { token = '' } = req.cookies;


    let userId = '';

    //comprobamos si es permitido el token, usamos la funcion de utils/jwt.ts si es valido
    //nos devuelve el _id del usuario ya que lo recibimos del payload del propio token
    try {
        userId = await jwt.isValidToken(token);
    } catch (error) {
        return res.status(401).json({
            message: 'Token de validacion no es valido'
        })
    }


    await db.connect();

    //buscamos en la base de datos si hay algun usuario con el id recibido 
    //usando el metodo de arriba jwt.isValidToken(token) de utils/jwt.ts
    //recibimos el usuario con toda su informacion
    const user = await User.findById(userId).lean();
    await db.disconnect();

    //si no existe el usuario mandamos un mensaje de error
    if (!user) {
        return res.status(400).json({ message: 'No existe usuario con el ID' })
    }

    const { _id, email, role, name } = user;

    return res.status(200).json({
        token : jwt.signToken( _id, email), //creamos un nuevo token, lo revalidamos
        user: {
            email, role, name
        }
    })

}