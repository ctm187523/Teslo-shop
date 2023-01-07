
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';


type Data = { 
    numberOfOrders: number; //numero total de ordenes
    paidOrders: number; //isPaid que sea true
    notPaidOrders: number; //ordenes no pagadas lo calculamos restando  numberOfOrders menos paidOrders
    numberOfClients: number; //role: client, clientes con el role de client
    numberOfProducts: number; //total del numero de productos
    productsWithNoInventory: number; //0 productos, no hay ese tipo de producto su estock esta en cero
    lowInventory: number; //productos con 10 o menos en stock
}

export default async function  handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    await db.connect();

    //hacemos todas la peticiones en paralelo para que sea mas rapido, sera de 
    //manera simultanea, usando el Promise.all, le pasamos un arreglo con todas la peticiones
    //el Promise.all devuelve un nuevo arreglo con cada uno de sus valores en sus respectivas posiciones
    //por lo tanto podemos desestructurar la respuesta poniendola en el mismo orden, como un array despues del const
    const [
        numberOfOrders,
        paidOrders,
        numberOfClients, 
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
    ] = await Promise.all([
          Order.count(),
          Order.find({ isPaid: true}).count(),
          User.find({ role: 'client'}).count(),
          Product.count(),
          Product.find({ inStock: 0}).count(),
        //le ponemos la condicion $lte(less than equal) , menor o igual a 10
          Product.find({ inStock: { $lte: 10}}).count()
    ]);


    await db.disconnect();

    res.status(200).json( {
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
        notPaidOrders : numberOfOrders - paidOrders
    });
     
    

}


