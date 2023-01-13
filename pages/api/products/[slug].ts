
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import Product from '../../../models/Product';
import { IProduct } from '../../../interfaces/products';

type Data =
    | { message: string }
    | IProduct //usamos la interfaz IProduct de interfaces/products para tipar la response


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {



    switch (req.method) {
        //nos retorna un producto buscado por su slug
        case 'GET':
            return getProductBySlug(req, res);

        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    }

}

//recibimos un producto por su slug
const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();

    //recibimos el slug de la query
    const { slug } = req.query;

    //importamos Product de models/Product para interactuar con la base de datos
    //usamos el findOne y ponemos el slug que queremos buscar el lean es para que no traiga tanta informacion
    const product = await Product.findOne({ slug }).lean();

    await db.disconnect();

    //si la entrada no se encuentra retornamos un mensaje de error y salimos
    if (!product) {
        return res.status(404).json({
            message: 'Producto no encontrado '
        });
    }

    //TODO procesamiento de las imagenes cuando las subamos al server, ya que si las teniamos en el fileSystem
    //debemos poner la ruta -> ${ process.env.HOST_NAME}products/${ image } usando las variables de entorno del hosting
    // y si la imagen viene de cloudinary ponemos directamente la imagen
    product.images = product.images.map(image => {
        //si la imagen icluye http quiere decir que viene de cloudinary
        return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
    });



    //mostramos el objeto encontrado
    res.status(200).json(product);

}