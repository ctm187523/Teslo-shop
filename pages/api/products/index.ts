
import type { NextApiRequest, NextApiResponse } from 'next';
import { db, SHOP_CONSTANTS } from '../../../database';
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

    //desestructuramos el gender de la request por defecto si no viene es all
    //la respuesta es si en el url usamos una query es decir despues del url http://localhost:3000/api/products hay un ? y ponemos gender
    //si no viene el gender por defecto es all y muestra todos los productos de la base de datos
    //con esto lo que queremos es filtrar por genero(gender)
    const { gender = 'all'} = req.query;

    //creamos una condicion de inicio vacio y en la condicion de abajo le damos el valor
    //esta condicion la usamos abajo en el Product.find
    let condition = {};

    //ponemos una condicion si gender no es all es decir se ha ingresado algo despues del interrogante 
    // y ademas validamos que el gender sea uno de la constante SHOP_CONSTANTS creado en database/constants
    //gender lo ponemos entre backtick(template strings) porque tiene que ser un string
    if(gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`) ) {
        condition = { gender: gender } //ponemos en la variable de arriba condition el valor del gender recibido en la request, podemos dejar solo { gender}
    }

    //conectamos a la base de datos
    await db.connect();

    //Hacemos la peticion a la base de datos con find usando el modelo Product de models/Product
    //el lean trae menos informacion si dejamos el find solo lo trae todo
    //con select seleccionamos los campos que queremos consultar, al final de la consulta
    //ponemos -_id para que el id no aparezca en la consulta si no lo ponemos asi sale el id
    const products = await Product.find(condition)
                                  .select('title images price inStock slug -_id')
                                  .lean(); 

    //desconectamos de la base de datos
    await db.disconnect();

    //mostramos los productos, el return no haria falta ponerlo
    return res.status(200).json(products); 
}