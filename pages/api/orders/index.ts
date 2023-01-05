import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { IOrder } from '../../../interfaces';
import { db } from '../../../database';
import { Order, Product } from '../../../models';

type Data =
    | { message: string }
    | IOrder

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {


    switch (req.method) {
        case 'POST':
            return createOrder(req, res);

        default:
            return res.status(400).json({ message: 'Bad request' })

    }


}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { orderItems, total } = req.body as IOrder; //recibimos la informacion de la request

    //verificar la session del usuario que este autenticado, usamos el metodo
    //getSession de next auth y le pasamos la request(req) por parametro, en la
    //request van las Cookies y en las Cookies la informacion de la session, si
    //hay session nos devuelve el email,name,role y _id del usuario
    const session: any = await getSession({ req })

    //si no hay una session abierta mandamos un mensaje de error y salimos del metodo
    if (!session) {
        return res.status(401).json({ message: 'Debe de estar autenticado para hacer esto' })
    }

    // Crear un arreglo con los ids de todos los productos que la persona quiere
    const productsIds = orderItems.map(product => product._id);

    await db.connect();

    //hacemos una consulta a la base de datos con el model Product y con find
    //buscamos los productos con el _id que sean iguales a los contenidos en el array
    //productsIds creado arriba
    const dbProducts = await Product.find({ _id: { $in: productsIds } });

    //queremos recibir los productos de la base de datos y compararlos con lo que obtenemos
    //del frontend para asegurarnos de que no ha habido ninguna manipulacion en el frontend

    try {

        //usamos un reducer para comparar los precios de la base de datos con los precios recibidos del frontend
        const subTotal = orderItems.reduce((prev, current) => {

            //comparamos los precios de cada uno de los articulos de la base de datos
            //que sea igual el id de los productos recibidos del frontend, ponemos la admiracion
            const currentPrice = dbProducts.find(prod => prod.id === current._id)?.price;

            //si no existe mandamos un errror, si no existiera quire decir que alguien a manipulado los datos
            if (!currentPrice) {
                throw new Error('Verifique el carrito de nuevo, producto no existe')
            }

            return (currentPrice * current.quantity) + prev

        }, 0)

        //obtenemo el impuesto de las variables de entorno .env
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

        //agregamos los impuestos al subTotal
        const backendTotal = subTotal * (taxRate + 1);

        //si el total recibido de la primera linea del req.body no cuadra con el total del backendTotal calculado
        //mostramos un error todos los throw iran al catch donde desconectaremos de la base de datos
        if (total !== backendTotal) {
            throw new Error('El total no cuadra con el monto')
        }

        //si todo esta bien primeramente obtenemos de la session obtenida arriba el user._id
        //y seguidamente creamos una nueva Order de los models Orders, esparcimos el req.body
        // y ponemos el isPaid como false por si alguin lo ha modificado y el user como userId obtenido en la linea de abajo
        const userId = session.user._id;
        const newOrder = new Order({ ...req.body, isPaid: false, user: userId });

        //redondeamos el total de la nueva orden creada a dos decimales
        newOrder.total = Math.round( newOrder.total * 100) /100;

        //grabamos en la base de datos la nueva orden
        await newOrder.save(); 
        
        await db.disconnect();
        return res.status(201).json( newOrder);



    } catch (error: any) {
        await db.disconnect();
        console.log(error);
        res.status(400).json({
            message: error.message || 'Revise los logs del servidor'
        })
    }

    return res.status(201).json(req.body);
}