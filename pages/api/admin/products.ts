

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IProduct } from '../../../interfaces/products';
import { Product } from '../../../models';
import { isValidObjectId } from 'mongoose';

//hemos instalado cloudinary para almacenar las imagenes --> yarn add cloudinary
//pagina cloudinary --> https://cloudinary.com/
//en las variables de entorno hemos puesto el url para cloudinary VER VIDEO 382
import { v2 as cloudinary } from 'cloudinary'
//configuramos la varialble de entorno de las variables de entorno .env
cloudinary.config(process.env.CLOUDINARY_URL || ''); //si no tiene lo ponemos como un string vacio


type Data =
    | { message: string }
    | IProduct[]
    | IProduct;


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProducts(req, res);

        case 'PUT':
            return updateProduct(req, res);

        case 'POST':
            return createProduct(req, res);
        default:
            return res.status(400).json({ message: 'Bad request' });
    }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();

    const products = await Product.find()
        .sort({ title: 'asc' }) //ordenamos por titulo en orden ascendente
        .lean();

    await db.disconnect();

    //actualizar las imagenes
    const updatedProducts = products.map(product => {

        //TODO procesamiento de las imagenes cuando las subamos al server, ya que si las teniamos en el fileSystem
        //debemos poner la ruta -> ${ process.env.HOST_NAME}products/${ image } usando las variables de entorno del hosting
        // y si la imagen viene de cloudinary ponemos directamente la imagen
        product.images = product.images.map(image => {
            //si la imagen icluye http quiere decir que viene de cloudinary
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        });

        return product;

    });

    return res.status(200).json(updatedProducts);
}

//funcion para actualizar los productos
const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { _id = '', images = [] } = req.body as IProduct;

    //validamos el id con el metodo isValidObjectId de Moongose
    if (!isValidObjectId(_id)) {
        return res.status(400).json({ message: 'El id del producto no es válido' });
    }

    if (images.length < 2) {
        return res.status(400).json({ message: 'Es necesario al menos 2 imágenes' });
    }

    // TODO: posiblemente tendremos un localhost:3000/products/asdasd.jpg


    try {

        await db.connect();
        const product = await Product.findById(_id);
        if (!product) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe un producto con ese ID' });
        }

        // TODO: eliminar fotos en Cloudinary que hayamos eliminado en la app
        product.images.forEach(async (image) => {
            //si las imagenes que recibimos de la request no coinciden las borramos de claudinary quiere decir qu el administrador de productos la ha borrado
            if (!images.includes(image)) {
                //Borramos de cloudinary
                //nos interesa de la url que recibimos ver ejemplo --> https://res.cloudinary.com/dc9gvorwa/image/upload/v1673634399/zhaqndirvkznrik6px8e.webp
                //el id con el que esta ubicado en cloudinary que es lo que sigue a la ultima / le ponemos +1 para que tambien borre la barra /
                //con el split('.') obtenemos un array donde la primera posicion es el id de la imagen y el segundo la extension
                //lo desestructuramos en las dos posiciones del array obtenidas con el split el fieldId y la extension
                const [fieldId, extension] = image.substring(image.lastIndexOf('/') + 1).split('.');
                console.log({ image, fieldId, extension })
                await cloudinary.uploader.destroy(fieldId); //llamamos a cloudinary y le decimos que borre la imagen con el id pasado
            }
        });


        await product.update(req.body); //actualizamos el producto con el body recibido del producto
        await db.disconnect();


        return res.status(200).json(product);

    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}

//metodo para la creacion de nuevos productos
const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { images = [] } = req.body as IProduct;

    if (images.length < 2) {

        return res.status(400).json({ message: 'El producto necesita al menos 2 imagenes' });
    }

    // TODO: posiblemente tendremos un localhost:3000/products/asdasd.jpg

    try {

        await db.connect();

        //buscamos si el producto ya existe en la base de datos por el slub
        const productInDb = await Product.findOne({ slug: req.body.slug });

        //si existe mandamos un mensaje de error
        if (productInDb) {
            await db.disconnect();
            return res.status(400).json({ message: 'Ya existe un producto con ese slug' });
        }

        //creamos un nuevo Producto usando Product de Models
        const product = new Product(req.body);
        await product.save(); //guardamos el nuevo producto en la base de datos
        await db.disconnect();

        res.status(201).json(product); //mandamos un 201 que significa creado

    } catch (error) {
        console.log(error)
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar logs del servidor' });
    }

}