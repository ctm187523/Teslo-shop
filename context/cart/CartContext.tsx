

import { createContext} from 'react';
import { ICartProduct } from '../../interfaces/cart';


//creamos una interfaz para mostrar como luce el contexto
interface ContextProps {
   cart: ICartProduct[]; //tipamos de tipo de la interfaz ICartProduct importada arriba

   //metodos
   addProductToCart: (product: ICartProduct) => void
}


//creamos el contexto para crear el provider y poder pasar informacion entre componentes
//usamos la interfaz de arriba para mostrar que atributos maneja el contexto
//para refrescar ver video --> https://www.youtube.com/watch?v=UPCOJgLlr3w
export const CartContext = createContext({} as ContextProps );