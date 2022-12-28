
import { CartState } from './';
import { ICartProduct } from '../../interfaces/cart';

//definimos las acciones con textos concretos
type CartActionType =
   | { type: '[Cart] - LoadCart from cookies | storage', payload: ICartProduct[] }
   | { type: '[Cart] - Update products in cart', payload: ICartProduct[] }
   | { type: '[Cart] - Change cart quantity', payload: ICartProduct }
   | { type: '[Cart] - Remove product in cart', payload: ICartProduct }
   | {
      type: '[Cart] - Update order summary',
      payload: {
         numberOfItems: number,
         subTotal: number,
         tax: number,
         total: number
      }
   }

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
            cart: [...action.payload] //el valor del carrito sera el nuevo array
         }

      case '[Cart] - Change cart quantity':
         return {
            ...state,
            cart: state.cart.map(product => {
               //discirminamos que el producto a buscar tenga primeramente el mismo id y la misma talla
               if (product._id !== action.payload._id) return product;
               if (product.size !== action.payload.size) return product;

               //modificamos la cantidad, lo comentamos porque si devolvemos directamente el action.payload ya esta modificado de inicio
               //product.quantity === action.payload.quantity

               return action.payload;
            })
         }


      case '[Cart] - Remove product in cart':
         return {
            ...state,
            //queremos filtrar los productos que no cumplen esa condicion, esta negada por tanto recibimos todos los productos que no cumplen esa condicion
            //que son el id y la talla igual al payload ya que si solo ponemos el id y hay dos productos iguales con diferentes tallas se borraran los dos
            cart: state.cart.filter(product => !(product._id === action.payload._id && product.size === action.payload.size))
         }

      case '[Cart] - Update order summary':
         return{
            ...state,
            ...action.payload
         }

      default:
         return state;
   }
}