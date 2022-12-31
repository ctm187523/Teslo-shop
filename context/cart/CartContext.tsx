

import { createContext } from 'react';
import { ICartProduct } from '../../interfaces/cart';
import { ShippingAddress } from './CartProvider';


//creamos una interfaz para mostrar como luce el contexto
interface ContextProps {
   isLoaded: boolean; //nos dice si hemos cargado el carrito de las Cookies
   cart: ICartProduct[]; //tipamos de tipo de la interfaz ICartProduct importada arriba
   //variables usadas para el calculo de la factura
   numberOfItems: number;
   subTotal: number;
   tax: number;
   total: number;

   //direccion de envio tomado de pages/checkout/address y importado
   //de la interface del CartProvider
   shippingAddress?: ShippingAddress

   //metodos
   addProductToCart: (product: ICartProduct) => void
   updateCartQuantity: (product: ICartProduct) => void
   removeCartProduct: (product: ICartProduct) => void
   updateAddress: (address: ShippingAddress) => void
}


//creamos el contexto para crear el provider y poder pasar informacion entre componentes
//usamos la interfaz de arriba para mostrar que atributos maneja el contexto
//para refrescar ver video --> https://www.youtube.com/watch?v=UPCOJgLlr3w
export const CartContext = createContext({} as ContextProps);