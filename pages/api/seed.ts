// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { db, seedDataBase } from '../../database'
import { Product, User } from '../../models';
import Order from '../../models/Order';



type Data = {
  message:string;
}

export default async function handler(req: NextApiRequest,res: NextApiResponse<Data>) {

  // si en las variables de entorno de NODE_ENV esta en produnction no se ejecuta el codigo de abajo
  //para evitar purgar la base de datos en produccion
  if ( process.env.NODE_ENV === 'production') {
    return res.status(401).json({ message: 'No tiene acceso a este servicio'})
  }


  await db.connect(); //nos conectamos a la base de datos importandola arriba en la linea 3

  //del modelo User importado arriba primeramente borramos la base datos y seguidamente
  //importamos los usuarios creados en seddDataBase desde el archivo database/seed-data
  //esto nos crea una tabla llamada users
  await User.deleteMany();
  await User.insertMany( seedDataBase.initialData.users);

  //importamos el Product de models/Product
  await Product.deleteMany(); //borramos todo lo de la base ded datos que se encuentre en la coleccion de entradas
  await Product.insertMany( seedDataBase.initialData.products); //insertamos desde el archivo database/seed-data los productos esto nos crea una tabla llamada products

  await Order.deleteMany(); //borramos las ordenes

  await db.disconnect(); //nos desconectamos al finalizar el trabajo

  res.status(200).json({ message: 'Proceso realizado correctamente' });
}

