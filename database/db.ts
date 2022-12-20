//instalamos mongoose con -> yarn add mongoose
import mongoose from 'mongoose';

/**
 * creamos la conexion
 * estados de la conexion
 *  0 = disconnected
 *  1 = connected
 *  2 = connecting
 *  3 = disconnecting
 */

const mongoConnection = {
    isConnected: 0
}

//función para conectar a la base de datos
export const connect = async () => {

    if (mongoConnection.isConnected) { //es decir vale 1
        console.log('Ya estabamos conectados');
        return;
    }

    //en el caso de que no estemos conectados revisamos moongose, miramos 
    //que no haya ninguna conexion adicional(connections > 0), si hay alguna conexion
    //usamos esa conexion, conocemos su estado con readyState
    if (mongoose.connections.length > 0) {
        mongoConnection.isConnected = mongoose.connections[0].readyState;

        //si es estado(readyState es 1 nos conectamos)
        if (mongoConnection.isConnected === 1) {
            console.log('Usando conexión anterior');
            return;
        }

        //en caso contrario si no es 1 nos desconectamos, para evitar tener muchas conexiones simultaneas
        await mongoose.disconnect();
    }

    //creamos una nueva conexion ya que nos habiamos anteriormente desconectado
    await mongoose.connect(process.env.MONGO_URL || ''); //usamos el archivo .env con las variables de entorno
    mongoConnection.isConnected = 1;
    console.log('Conectado a MongoDB', process.env.MONGO_URL);
}

//funcion para desconectar de la base de datos
export const disconnect = async () => {

    if ( process.env.NODE_ENV === 'development') return; // si esta en desarrollo sale de al funcion
    
    if (mongoConnection.isConnected === 0) return; //si es igual a cero sale de la funcion porque ya esta desconectado
    
    await mongoose.disconnect();
    mongoConnection.isConnected = 0;

    console.log('Desconectado de MongoDb');
}