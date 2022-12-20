
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import Product from '../../../models/Product';
import { IProduct } from '../../../interfaces/products';

//tipamos la Data, lo que vamos a recibir
type Data = 
    | {message: string}
    | IProduct[] //interfaz de tipado de los productos de interfaces/products

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProducts( req, res)
           
        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    }
}

//funcion para hacer la peticion de los productos de la base de datos
const getProducts = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    //conectamos a la base de datos
    await db.connect();

    //Hacemos la peticion a la base de datos con find usando el modelo Product de models/Product
    //el lean trae menos informacion si dejamos el find solo lo trae todo
    //con select seleccionamos los campos que queremos consultar, al final de la consulta
    //ponemos -_id para que el id no aparezca en la consulta si no lo ponemos asi sale el id
    const products = await Product.find()
                                  .select('title images price inStock slug -_id')
                                  .lean(); 

    //desconectamos de la base de datos
    await db.disconnect();

    //mostramos los productos, el return no haria falta ponerlo
    return res.status(200).json(products); 
}