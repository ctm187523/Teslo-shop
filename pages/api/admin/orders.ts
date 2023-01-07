

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { Order } from '../../../models';
import { IOrder } from '../../../interfaces/order';

type Data =
|{  message: string}
|IOrder[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {

        case 'GET':
            return getOrders( req, res);
           
    
        default:
            return res.status(400).json( { message: 'Bad Request'});
    }

}

const getOrders = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();

    //usamos Order de los modelos y pedimos todas las ordenes ordenadas en orden
    //descendente y como criterio cojemos la fecha de creacion
    const orders = await Order.find()
        .sort({ createdAt: 'desc'})
        .populate('user', 'name email') //con populate podemos acceder a los usuarios gracias a la referencia en el modelo Order que hacemos con user, de user extraemos el nombre y el mail el id viene por defecto
        .lean();

    await db.disconnect();

    return res.status(200).json(orders)
}