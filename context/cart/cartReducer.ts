
import { CartState} from './';
import { ICartProduct } from '../../interfaces/cart';

//definimos las acciones con textos concretos
type CartActionType = 
| { type: '[Cart] - LoadCart from cookies | storage', payload: ICartProduct[]}
| { type: '[Cart] - Add Product', payload: ICartProduct}

//el reducer es una funcion pura porque todos sus valores de retorno los obtiene
//unicamente de los valores que recibe, no tiene ninguna interaccion con el mundo exterior
//recibe el estado de tipo CartStAte definicdo en el archivo CartProvider.tsx  y la action del tipo de finido arriba CartActionType, devuelve un CartState
//el Reducer siempre devuelve un nuevo estado no una mutacion del estado usamos el spread (...) para ello
export const cartReducer = (state: CartState, action: CartActionType): CartState => {

   switch (action.type) {
       case '[Cart] - LoadCart from cookies | storage':
          return {
          ...state,
       }

       case '[Cart] - Add Product':
          return {
             ...state, 
             cart: [ ...state.cart, action.payload]
          }

        default:
           return state;
    }
}