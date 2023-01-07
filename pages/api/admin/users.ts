
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IUser } from '../../../interfaces';
import { User } from '../../../models';
import { isValidObjectId } from 'mongoose';

type Data = 
| { message: string;}
| IUser[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getUsers(req, res);

        case 'PUT':
            return updateUser(req, res);
    
        default:
            return res.status(400).json( { message: 'Bad request'});
    }
}


//funcion para obtener los usuarios
const getUsers = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();

    //con select('-password') le decimos que queremos obtner la informacion de los
    //usuarios excepto el password por eso esta con el signo menos delante
    const users = await User.find().select('-password').lean();

    await db.disconnect();

    return res.status(200).json( users );

    

}

const updateUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { userId= '', role = ''} = req.body;

    //nos aseguramos que se in id de mongo
    if ( !isValidObjectId(userId)) {
        return res.status(400).json( { message: 'No existe usuario con ese Id'});
    }

     //comprobamos que el usuario sea uno de los roles validos
     const validRoles = ['admin', 'super-user','SEO','client'];
     if ( !validRoles.includes(role)){
        return res.status(400).json( { message: 'Rol no permitido' + validRoles.join(', ')});
     }

     await db.connect();
     //buscamos el usuario por el id
     const user = await User.findById( userId );

     if(!user ) {
        await db.disconnect();
        return res.status(400).json( { message: 'Usuario no encontrado' + userId});
     }

     //actualizamos el role del usuario con el role recibido el req.body
     user.role = role;
     await user.save(); //salvamos los cambios

     await db.disconnect();

     return res.status(200).json( { message: 'Usuario actualizado'});


}