
import { FC, useReducer, useEffect } from 'react';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './'
import tesloApi from '../../api/tesloApi';
import Cookies from 'js-cookie';
import axios from 'axios';


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


    //usamos un useEffect para que se dispare una sola vez al cargar este componente y llame 
    //a la funcion checkToken de abajo
    useEffect(() => {

        checkToken();

    }, [])

    //funcion que se encarga cada vez que se refresca la pagina o se sale
    //se valida el token para que se registren los datos del logout del usuario
    //y no se pierdan al refrescar la pagina
    const checkToken = async () => {

        try {

            //llamar al endpoint para validar el token alojado en la Cookies, ver el endpoint ya se encarga de llamar a las Cookies
            const { data } = await tesloApi.get('/user/validate-token');
            const { token, user } = data; //recibimos un nuevo token y los datos del usuario que tenia el token anteriormente evaluado

            //al llamar al endpoint /user/validate-token se crea un nuevo token lo guardamos en las Cookies
            Cookies.set('token', token);

             //dispatch de login mandamos el user para que se mantenga en el state y de esta manera no se pierde al refrescar la pagina
            dispatch({ type: '[Auth] - Login', payload: user });

        } catch (error) {

            Cookies.remove('token');

        }
    }

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

    return (
        //usamos el componente de Contexto(create Context) AuthContext
        //definimos el value que es lo que se compartira con el resto de componentes
        //el children lo compondran los componentes incluidos en este Provider
        <AuthContext.Provider value={{
            ...state,

            //metodos
            loginUser,
            registerUser,
        }}>
            { children}
        </AuthContext.Provider>
    )
};