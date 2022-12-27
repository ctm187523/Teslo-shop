
import { CartState} from './';
import { ICartProduct } from '../../interfaces/cart';

//definimos las acciones con textos concretos
type CartActionType = 
| { type: '[Cart] - LoadCart from cookies | storage', payload: ICartProduct[]}
| { type: '[Cart] - Update products in cart', payload: ICartProduct[]}

//el reducer es una funcion pura porque todos sus valores de retorno los obtiene
//unicamente de los valores que recibe, no tiene ninguna interaccion con el mundo exterior
//recibe el estado de tipo CartStAte definicdo en el archivo CartProvider.tsx  y la action del tipo de finido arriba CartActionType, devuelve un CartState
//el Reducer siempre devuelve un nuevo estado no una mutacion del estado usamos el spread (...) para ello
export const cartReducer = (state: CartState, action: CartActionType): CartState => {

   switch (action.type) {
      case '[Cart] - LoadCart from cookies | storage':
         return {
            ...state,
            cart: [...action.payload]
          }

       //al añadir un nuevo producto en el CartProvider antes de llamar esta funcion preprocesa la informacion
       //para que los productos se añadan correctamente, el usuario si le da dos veces añadir el mismo producto
       //no se creen dos productos con 1 cantidad sino que el mismo producto la cantidad sea 2
       case '[Cart] - Update products in cart':
          return {
             ...state, 
             cart: [ ...action.payload] //el valor del carrito sera el nuevo array
          }

        default:
           return state;
    }
}