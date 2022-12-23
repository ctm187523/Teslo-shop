
import { IProduct } from '../interfaces/products';

//hemos importado el hook de Next swr con --> yarn add swr de la web --> https://swr.vercel.app/es-ES/docs/getting-started
//este hook es el que recomienda Next para hacer peticiones http similar a axios
//importamos tambien SWRConfiguration
import useSWR, { SWRConfiguration } from "swr";
//Para APIs RESTFul normales con datos JSON, primero necesitamos crear una función fetcher, 
//que no es más que una envoltura del fetch nativo,la comentamos abajo no la usamos, la usamos de forma global en pages/_app.tsx
//const fetcher = (...args: [key: string]) => fetch(...args).then(res => res.json());


//recibe por parametro el url como string y config de tipo SWRConfiguration importado arriba de swr
//en el config decimos como seran las peticiones estan definidas de forma global en pages/_app.tsx si no vienen sera un objeto vacio
export const useProducts = ( url: string, config: SWRConfiguration = { }) => {

    //usamos el Hook swr importado arriba para las peticiones http, data contiene la informacion
    // usamos el parametro url para realizar la peticion, endpoint
    //fetcher: (opcional) una función que devuelve una Promise para recuperar sus datos
    //la informacion de retorno es un IProduct de interfaces/products --> useSWR<IProduct[]>
    //comentamos la siguiente linea y usamos la otra porque no usamos el fetcher ya que la linea 10 esta comentada
    //const { data, error } = useSWR<IProduct[]>(`/api${ url }`, fetcher, config);
    const { data, error } = useSWR<IProduct[]>(`/api${ url }`, config);

    return {
        products : data || [], //si no hay productos devolvemos un arreglo vacio
        isLoading: !error && !data, //el isLoading lo tenemos si no hay error y no hay data
        isError: error //mandamos el error
    }

}


