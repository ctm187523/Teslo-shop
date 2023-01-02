
//archivo para validar el Email y el Password de los usuarios este archivo
//es creado para ser utilizado con next auth

import { User } from "../models";
import { db } from "./"
import bcrypt from 'bcryptjs';

export const ckeckUserEmailPassword = async ( email: string, password: string) => {

    await db.connect();

    //usamos User de los modelos de moongose para verificar si existe el email
    //recibimos en la constante user los datos del usuario como el password
    const user = await User.findOne({ email });

    await db.disconnect();

    //si no existe el email en la base de datos retornamos null 
    if ( !user ){
        return null; 
    }

    //importamos el modulo bcrypt, para ver si el password recibido en la constante user de arriba
    //hace match con el password recibido por parametro, en este caso evaluamos si no hace match retornamos null
    //ponemos el signo de admiracion ! indicando que siempre lo vamos a tener ya que lo otenemos de la base de datos
    if ( !bcrypt.compareSync( password, user.password!) ) {
        return null;
    }

    //si hace match extraemos los datos del usuario
    const { role, name, _id} = user;

    return {
        _id,
        email: email.toLocaleLowerCase(),
        role,
        name
    }  
}

//Esta funcion crea o verifica un usuario de OAuth(que se esta logueando a traves de una red social)
export const oAuthToDbUser = async( oAuthEmail: string, oAuthName: string) => {

    await db.connect();
    
    //verificamos si mediante el correo recibido ya existe el usuario en nuestra base de datos
    //usamos User de los modelos de moongose para verificar si existe el email
    const user = await User.findOne({ email: oAuthEmail });

    //si existe retornamos los datos del usuario
    if ( user ) {
        await db.disconnect();
        const { _id, name, email, role } = user;
        return { _id, name, email, role }; //retornamos la informacion para la session
    }

    //si no lo tenemos lo creamos, en el password ponemos una @ ya que no podemos saber el password si ha echo
    //login desde una red social ponemos @ porque nunca hara match con una contraseña con hash si quisieramos entrar
    //con el email y el password que ponemos(@), el role si alguien se autentica con red social siempre es client
    //usamos el User de los modelos para crear un nuevo usuario
    const newUser = new User({ email: oAuthEmail, name: oAuthName, password: '@', role: 'client'});

    await newUser.save(); //lo insertamos en la base de datos
    await db.disconnect();
    //extraemos la informacion del nuevo usario creado para que forme parte de la  session del usuario
    const { _id, name, email, role } = newUser;

    return { _id, name, email, role };

}