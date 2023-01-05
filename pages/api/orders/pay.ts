
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { IPaypal } from '../../../interfaces';
import { Order } from '../../../models';


type Data = {
    message: string;
}

export default function handeler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return payOrder(req,res);
          
        default:
            res.status(400).json({ message: 'Bad request' });
    }

}


//VER VIDEO 399
//metodo para obtener el Token para validar la transaccion con Paypal
const getPaypalBearerToken = async():Promise<string|null> => {

    //obtenemos las contraseñas que obtuvimos al crear en la pagina de paypal la app teslo-shop
    //y almacenado en las variables de entorno .env ver video 336
    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

    //ponemos en la constante base64Token las contraseñas para poder conseguir el token de paypal para ver si el pago ha sido efectuado
    //lo comprobamos en el backend no podemos confiar en el frontend porque puede ser manipulado
    const base64Token = Buffer.from(`${ PAYPAL_CLIENT}:${ PAYPAL_SECRET }`, 'utf-8').toString('base64');

    //creamos el body que va en el post de la peticion de abajo
    const body = new URLSearchParams('grant_type=client_credentials')

    try {
        
        //importamos arriba axios y hacemos un post a la url que tenemos en lsa varaibles .env
        const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
            
            //creamos los headers del post con Autorization donde mandamos las claves y el content-type
            headers: {
                'Authorization': `Basic ${ base64Token }`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return data.access_token; //retornamos el token recibido

    } catch (error) {
        
        //si es error de axios mostramos el error si no mostramos el error
        if( axios.isAxiosError(error)) {
            console.log(error.response?.data);
        }else{
            console.log(error);
        }

        return null; //si sale mal retornamos null
    }
}

//metodo para confirmar el pago con paypal
const payOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    //Todo: validar sesion del usuario
     //Todo: validar MongoID

    //recibimos el token usando el metodo de arriba
    const paypalBearerToken = await getPaypalBearerToken();

    if ( !paypalBearerToken ){
        return res.status(400).json({ message: 'No se pudo confirmar el token de paypal'})
    }

    // si todo sale bien de la request obtenemos del body el transactionId que es el id de la transaccion
    // y el orderId que es el Id que genera mongo en la base de datos cuando generamos una orden
    const { transactionId ='', orderId = ''  } = req.body;

    // hacemos la peticion de la transaccion mandamos la direccion de las variables de entorno env,
    //concatenado con la barra / con la transactionId obtenida arriba de la request
    //en los headers de la peticion ponemos el token obtenido arriba
    //esta tipado con la interfaz creada IPaypal en interfaces/paypal, para crearla en postman copiamos la respuesta
    // y con shift+command+p usamos PASTE JSON AS CODE ver video 340
    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${ transactionId } `, {
        headers: {
            'Authorization': `Bearer ${ paypalBearerToken }`
        }
    });

    //hacemos las validaciones con la data obtenida primero vemos si el es status es COMPLETED
    if ( data.status !== 'COMPLETED') {
        return res.status(400).json({ message: 'Orden no reconocida'})
    }

    //nos conectamos con la base de datos y comprobamos si el orderId recibido coincide con el orderId que tenemos en la base de datos
    //el orderId lo obtuvimos arriba de la request req.body
    await db.connect();
    const dbOrder = await Order.findById(orderId);
    
    if ( !dbOrder){
        await db.disconnect();
        return res.status(400).json({ message: 'Orden no existe en nuestra base de datos'})
    }

    //comprobamos que el total de la factura que tenemos en la base de datos sea igual al que recibimos de la data
    if ( dbOrder.total !== Number(data.purchase_units[0].amount.value)){
        await db.disconnect();
        return res.status(400).json({ message: 'Los montos de PayPal y nuestra orden la base de datos no son iguales'})
    }

    //Si todo sale bien
    //ponemos en la orden de la base de datos el transactionId generado
    dbOrder.transactionId = transactionId;
    dbOrder.isPaid = true; //ponemos en true como pagado la orden 
    await dbOrder.save(); //salvamos la orden con las modifiaciones

    //TODO enviar correo o lo qye vayamos a usar para indicar que hay una nueva orden

    await db.disconnect();

    res.status(200).json({ message: 'Orden pagada' });
}