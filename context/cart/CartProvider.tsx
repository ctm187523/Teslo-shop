
import { FC, useReducer, ReactElement } from 'react';
import { CartContext, cartReducer } from './'
import { ICartProduct } from '../../interfaces/cart';

//creamos la interfaz para las props del componente
interface Props {
    children: ReactElement | ReactElement[];
}

//creamos una interfaz para el tipado de las propiedades a compartir, lo
//usamos para tipar el estado inicial y en el ./cartReducers para tipar el state
//y el return 
export interface CartState {
    cart: ICartProduct[];
}

//usamos la interfaz creada arriba para el estado inicial
const CART_INITIAL_STATE: CartState = {
    cart: []
}

export const CartProvider: FC<Props> = ({ children }) => {
    //usamos el Hook useReducer de React como estado inicial ponemos el objeto creado arriba
    //CART_INITIAL_STATE, como reducer usamos el reducer creado cartReducer
    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

    const addProductToCart = ( product:ICartProduct) => {
        dispatch( { type:'[Cart] - Add Product', payload:product})
    }

    return (
        //usamos el componente de Contexto(create Context) CartContext
        //definimos el value que es lo que se compartira con el resto de componentes
        //el children lo compondran los componentes incluidos en este Provider
       <CartContext.Provider value={{
           ...state,

           //Metodos
           addProductToCart
       }}>
           { children }
       </CartContext.Provider>
    )
};