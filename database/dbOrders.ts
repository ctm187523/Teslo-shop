import { isValidObjectId } from "mongoose";
import { db } from ".";
import { IOrder } from "../interfaces";
import { Order } from "../models";

//funcion para tomar de la base de datos una order por Id de la order retorna una promesa
//que retorna un IOrder o null
export const getOrderById = async( id:string):Promise<IOrder | null > => {

    //comprobamos que el id es valido usando el metodo isValidObjectId de Moongose
    if( !isValidObjectId(id)){
        return null;
    }

    await db.connect();

    //usamos Order de los modelos para hacer la peticion a la base de datos
    const order = await Order.findById(id).lean();

    await db.disconnect();

    if ( !order ){
        return null;
    }

    return JSON.parse(JSON.stringify(order)); //devolvemos la orden parseada para que no de problemas

}

//funcion que retorna el listado de ordenes de un usuario
export const getOrdersByUser = async(userId: string): Promise<IOrder[]> => {

    //comprobamos que el id es valido usando el metodo isValidObjectId de Moongose
    if( !isValidObjectId(userId)){
        return [];
    }

    await db.connect();

    //buscamos en la base de datos las ordenes que tengan el id del usuario pasado por parametro
    const orders = await Order.find({ user: userId}).lean();

    await db.disconnect();


    return JSON.parse(JSON.stringify(orders));
}