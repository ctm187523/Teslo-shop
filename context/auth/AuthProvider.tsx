
import { FC, useReducer, useEffect } from 'react';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './'
import tesloApi from '../../api/tesloApi';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSession, signOut} from "next-auth/react";



//creamos una interfaz para el tipado de las propiedades a compartir, lo
//usamos para tipar el estado inicial y en el ./uiReducers para tipar el state
//y el return 
export interface AuthState {
    isLooggedIn: boolean;
    user?: IUser
}

//usamos la interfaz creada arriba para el estado inicial
const Auth_INITIAL_STATE: AuthState = {
    isLooggedIn: false,
    user: undefined,
}

export const AuthProvider: FC = ({ children }) => {

    //usamos el Hook useReducer de React como estado inicial ponemos el objeto creado arriba
    //Auth_INITIAL_STATE, como reducer usamos el reducer creado AuthReducer
    const [state, dispatch] = useReducer(authReducer, Auth_INITIAL_STATE);

    //importamos el Hook useRouter de Next 
    const router = useRouter();

    //usamos el Hook useSession de nextauth instalado ver video 299 para leer toda la
    //informacion del cliente loggueado a traves de un proveedor(en este caso GitHub)
    //desestructuramos y obtenemos la data y es status
    const { data, status} = useSession();
    


    //usamos un useEffect para que se dispare una sola vez al cargar este componente y llame 
    //a la funcion checkToken de abajo
    //LO COMENTAMOS PORUQE USAMOS EN LUGAR DE DE NUESTRA PERSONAL AUTENTICACION USAMOS NEXT AUTH
    //EL CODIGO DE NEXT AUTH ESTA EN EL USE EFFECT DE ABAJO
    // useEffect(() => {

    //     checkToken();

    // }, [])

    //usamos el useEffect para que cada vez que cambie el status y la data como dependencias,
    //revise el status obtenido del  hook del useAuth useSession creado arriba
    useEffect(() => {
        
        //recibimos el status gracias al hook de next auth useSession implementado arriba
        if( status === 'authenticated') {
            //recibimos la data?.user gracias al hook de next auth useSession implementado arriba
            dispatch( { type: '[Auth] - Login', payload: data?.user as IUser })
        }
        
    }, [status, data])

    //funcion que se encarga cada vez que se refresca la pagina o se sale
    //se valida el token para que se registren los datos del logout del usuario
    //y no se pierdan al refrescar la pagina
    //NO USAMOS ESTA FUNCION PORQUE DE DONDE ERA LLAMADA ESTA COMENTADO PORQUE 
    //EN SU LUGAR USAMOS NEXTAUTH
    // const checkToken = async () => {

    //     //comprobamos que hay un token en las Cookies, en caso de que no lo haya salimos del metodo
    //     if (!Cookies.get('token')) {
    //         return;
    //     }

    //     try {

    //         //llamar al endpoint para validar el token alojado en la Cookies, ver el endpoint /user/validate-token' ya se encarga de llamar a las Cookies 
    //         const { data } = await tesloApi.get('/user/validate-token');
    //         const { token, user } = data; //recibimos un nuevo token y los datos del usuario que tenia el token anteriormente evaluado

    //         //al llamar al endpoint /user/validate-token se crea un nuevo token lo guardamos en las Cookies
    //         Cookies.set('token', token);

    //         //dispatch de login mandamos el user para que se mantenga en el state y de esta manera no se pierde al refrescar la pagina
    //         dispatch({ type: '[Auth] - Login', payload: user });

    //     } catch (error) {

    //         Cookies.remove('token');

    //     }
    // }

    //funcion para verificar si el usuario ha echo login devuelve una promesa, como es async devuelve una promes
    //es de tipo boolean el valor de la promesa devuelta, true autenticado, false no autenticado
    const loginUser = async (email: string, password: string): Promise<boolean> => {

        try {

            //usamos axios creado en api/tesloApi para la peticion post, mandando los argumentos despues de definir la ruta del endpoint
            const { data } = await tesloApi.post('/user/login', { email, password });
            const { token, user } = data;

            //grabamos el token en las Cookies
            Cookies.set('token', token);

            //hacemos el dispatch y pasamos como payload el user
            dispatch({ type: '[Auth] - Login', payload: user });
            return true; //si todo sale bien reetornamos true

        } catch (error) {
            return false; //si sale mal retornamos false
        }
    }

    //funcion para un nuevo registro recibe por parametors el name, email y password y de veukve una promesa de un objeto que contiene hashError y message opcional
    //se podia hacer el objeto que devuelve con una interfaz y ponerla entre las llaves de la Promise
    const registerUser = async (name: string, email: string, password: string): Promise<{ hashError: boolean; message?: string }> => {

        try {

            //usamos axios creado en api/tesloApi para la peticion post, mandando los argumentos despues de definir la ruta del endpoint
            const { data } = await tesloApi.post('/user/register', { name, email, password });
            const { token, user } = data;

            //grabamos el token en las Cookies
            Cookies.set('token', token);

            //hacemos el dispatch y pasamos como payload el user, logueamos al usuario uan vez registrado
            dispatch({ type: '[Auth] - Login', payload: user });

            //si todo sale bien devolemos un objeto
            return {
                hashError: false
            }


        } catch (error) {

            //nos podemos encontrar que el error sea debido a axios por ejemplo que ya existia alguien con ese correo
            //usamos axios importado arriba de axios
            if (axios.isAxiosError(error)) {
                return {
                    hashError: true,
                    message: error.response?.data.message
                }
            }

            //si no es un error de axios
            return {
                hashError: true,
                message: 'No se pudo crear al usuario intentelo de nuevo'
            }

        }

    }

    //funcion para logout
    const logout = () => {
        //borramos el carrito
        
        Cookies.remove('cart');

        //borramos cada uno de los valores del formulario en las cookies
        Cookies.remove('firstName');
        Cookies.remove('lastName');
        Cookies.remove('address');
        Cookies.remove('address2');
        Cookies.remove('zip');
        Cookies.remove('city');
        Cookies.remove('country');
        Cookies.remove('phone');

        //Estas dos instrucciones de abajo las borramos porque next auth ya se encarga de hacerlo
        //Cookies.remove('token');
        //router.reload(); //usamos el useRouter importado arriva y con reload hacemos un refresh para limpiar todo el estado de la aplicacion

        //usamos signOut de nextauth importado arriba para hacer el logout
        signOut();
    }

    return (
        //usamos el componente de Contexto(create Context) AuthContext
        //definimos el value que es lo que se compartira con el resto de componentes
        //el children lo compondran los componentes incluidos en este Provider
        <AuthContext.Provider value={{
            ...state,

            //metodos
            loginUser,
            registerUser,
            logout
        }}>
            { children}
        </AuthContext.Provider>
    )
};