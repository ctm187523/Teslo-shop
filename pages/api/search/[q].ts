
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import Product from '../../../models/Product';
import { IProduct } from '../../../interfaces/products';

type Data = 
   | {message: string}
   | IProduct[]


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method ) {
        case 'GET':
            return searchProducts( req, res )
    
        default:
            return res.status(400).json({
                message: 'Bad Request'
            })
    }

}

//buscamos productos gracias al indice creado en models/Product linea 40
//en el indice creado buscamos en el title y en los tags, puede devolver mas de un prducto que cumpla la condicion
const searchProducts = async( req: NextApiRequest, res: NextApiResponse<Data>) => {

    //recuperamos el q, que es como hemos llamado al archivo, q de query, y lo ponemos
    //en una variable let, si no viene sera un string vacio
    let { q = '' }  = req.query;

    //usamos un condicional if para ver si el query esta vacio, en ese caso salimos y mostramos un mensaje
    if ( q.length === 0 ){
        return res.status(400).json({
            message: 'Debe de especificar el query de búsqueda'
        })
    }

    //pasamos la query q todo a minusculas
    q = q.toString().toLowerCase();
    
    await db.connect();

    //para realizar la busqueda usamos el indice creado en models/Product linea 40
    //en el indice creado buscamos en el title y en los tags, puede devolver mas de un prducto que cumpla la condicion
    const products = await Product.find({
        //usamos el indice creado en models/Product linea 40
        $text: { $search: q }
    })
    .select('title images price inStock slug -_id') //seleccionamos los campos title images price inStock y ponemos -_id para que el id no aparezca en el resultado de la consulta
    .lean();

    await db.disconnect();

    return res.status(200).json(products);
}