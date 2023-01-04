
import { FC, useReducer, ReactElement, useEffect } from 'react';
import { CartContext, cartReducer } from './'
import { ICartProduct } from '../../interfaces/cart';
import Cookies from 'js-cookie';

//he instalado para manejar las cookies desde el frontend --> yarn add js-cookie
//para el backend yo lo hace sin instalar nada
//para manejar este paquete de Cookies con typeScript he instalado --> yarn add -D @types/js-cookie
import Cookie from 'js-cookie';
import { ShippingAddress } from '../../interfaces';
import { tesloApi } from '../../api';
import { IOrder } from '../../interfaces/order';
import axios from 'axios';


//creamos una interfaz para el tipado de las propiedades a compartir, lo
//usamos para tipar el estado inicial y en el ./cartReducers para tipar el state
//y el return 
export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number,
    subTotal: number,
    tax: number,
    total: number,

    //tomado de interfaces/order, puede ser opcional
    //porque son los valores que recibimos de las Cookies
    shippingAddress?: ShippingAddress;
}



//usamos la interfaz creada arriba para el estado inicial
const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined
}

export const CartProvider: FC = ({ children }) => {
    //usamos el Hook useReducer de React como estado inicial ponemos el objeto creado arriba
    //CART_INITIAL_STATE, como reducer usamos el reducer creado cartReducer
    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

    //usamos un useEffect para cada vez que recargue la pagina tome de las Cookies los productos
    //acumulados para el carrito, ya que cada vez que se recarga la pantalla se pierde la informacion en el context
    useEffect(() => {

        //usamos un try y catch por si no se puede parsear la Cookie, pudiera ser que alguin manipulara la Cookie
        //en caso de que no se pueda parsear en el catch mandamos un string vacio
        try {

            //creamos una constante para obtener las cookies evaluamos con un ternario que si hay cookies lo parsee a un objeto 
            //el simbolo de admiracion ! final es para decirle que si que hay un objeto que no vendra undefine ya que antes
            //lo evaluamos si no ponemos el signo ! da error si no hay cookies devolvemos un objeto vacio
            const cookieProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : []

            //con el dispatch llamamos al reducer para que en la opcion del switch LoadCart from cookies | storage reciba la informacion de las Cookies
            dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: cookieProducts });

        } catch (error) {
            dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: [] });
        }


    }, []);


    //para introducir el state actualizado a las Cookies usamos el Hook useEfect, cada vez
    //que el state cambie ponemos como dependencia el state.cart en el useEffect  y asi al actualizarlo lo 
    //almacenamos en las Cookies
    useEffect(() => {
        //como el state.cart es un objeto con JSON.stringify lo serializamos a un string que es como deben de trabajar las Cookies
        Cookie.set('cart', JSON.stringify(state.cart));

    }, [state.cart])


    //usamos otro useEffect aunque la dependencia sea la misma, state.cart, como va a hacer funciones distintas React recomienda usar
    //diferentes useEffect para funciones distintas, este efecto se encargara de manejar el numero de items, el total a pagar los impuestos
    //y el subtotal
    useEffect(() => {

        //usamos la funciom de javascript reduce para contar todos los items totales del state.cart( ver funcionamiento reducer ), el cero del final es el valor por el que empieza
        //prev es el valor anterior( de inicio es cero), current es el propio objeto y luego lo que hacemos es de cada uno de los objetos sumar el valor anterior, empezando por cero
        const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0)

        //usamos de nuevo el reducer para calcular el subtotal que sera el precio por las cantidades que lleva cada producto mas el valor anterior del calculo de los otros productos, de inicio es cero
        const subTotal = state.cart.reduce((prev, current) => (current.price * current.quantity) + prev, 0)

        //el taxRate es el IVA del 21% lo tomamos de las variables de entorno al comenzar por NEXT_PUBLIC
        //hacemos que se puede ver en el frontend, lo ponemos en Number para transformarlo a number ya que de
        //las variables viene como string en caso de que no exista la variable devuelve cero
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

        //objeto que contiene todos los calculos anteriores
        const orderSummary = {
            numberOfItems,
            subTotal,
            tax: subTotal * taxRate,
            total: subTotal * (taxRate + 1)
        }

        dispatch({ type: '[Cart] - Update order summary', payload: orderSummary });

    }, [state.cart]);


    //creamos un useEffect para cuando se recargue la pagina obtenga de las Cookies en el state
    //toda la informacion sobre la direccion de envio, 
    useEffect(() => {

        //nos aseguramos antes de hacer el dispatch que en las Cookies haya informacion
        if (Cookie.get('firstName')) {
            const shippingAddress = {
                firstName: Cookies.get('firstName') || '',
                lastName: Cookies.get('lastName') || '',
                address: Cookies.get('address') || '',
                address2: Cookies.get('address2') || '',
                zip: Cookies.get('zip') || '',
                city: Cookies.get('city') || '',
                country: Cookies.get('country') || '',
                phone: Cookies.get('phone') || '',
            }

            dispatch({ type: '[Cart] - LoadAddress from Cookies', payload: shippingAddress })
        }

    }, []);


    const addProductToCart = (product: ICartProduct) => {

        //some devuelve un valor booleano estamos evaluando si en el state ya existe un producto con el mismo id
        const productInCart = state.cart.some(p => p._id === product._id);

        //si no hay ningun producto en el state con el mismo id hacemos el dispatch añadiendo el nuevo producto al carrito
        if (!productInCart) return dispatch({ type: '[Cart] - Update products in cart', payload: [...state.cart, product] })

        //si existe el mismo producto en el carrito, comprobamos con some que devuelve un booleano si es el mismo id y ademas la misma talla
        const productInCartButDifferentSize = state.cart.some(p => p._id === product._id && p.size === product.size);

        //si es el mismo producto pero diferentes tallas por lo tanto es false no cumple la condicion hacemos el dispatch añadiendo el nuevo producto al carrito
        if (!productInCartButDifferentSize) return dispatch({ type: '[Cart] - Update products in cart', payload: [...state.cart, product] })

        //si llegamos aqui quiere decir que en el state ya hay un producto con el mismo id y ademas tiene la misma talla
        //usamos un map, el map regresa un nuevo arreglo basado en el arreglo evaluado(state.cart) pero permite mutarlo
        const updatedProducts = state.cart.map(p => {
            //si el producto del state.cart no coincide con el id del producto a ingresar salimos y no lo editamos ese producto
            //buscamos el producto que coincida con el state.cart
            if (p._id !== product._id) return p;

            //si pasa la evaulacion anterior ahora buscamos el producto que ademas del mismo id tenga el mismo size que el state
            if (p.size !== product.size) return p;

            //si pasa todos las anteriores condiciones actualizamos la cantidad
            p.quantity += product.quantity;
            return p;
        });

        //hacemos el dispatch añadiendo el nuevo estado
        dispatch({ type: '[Cart] - Update products in cart', payload: updatedProducts })
    }

    //metodo para actualizar la cantidad del producto cuando en el carrito se quiere cambiar la cantidad seleccionada
    const updateCartQuantity = (product: ICartProduct) => {
        dispatch({ type: '[Cart] - Change cart quantity', payload: product });
    }

    //funcion para borrar los productos del carrito
    const removeCartProduct = (product: ICartProduct) => {

        dispatch({ type: '[Cart] - Remove product in cart', payload: product })
    }

    //funcion para actualizar la direccion de envio
    const updateAddress = (address: ShippingAddress) => {

        //grabamos cada uno de los valores del formulario en las cookies
        Cookies.set('firstName', address.firstName);
        Cookies.set('lastName', address.lastName);
        Cookies.set('address', address.address);
        Cookies.set('address2', address.address2 || '');
        Cookies.set('zip', address.zip);
        Cookies.set('city', address.city);
        Cookies.set('country', address.country);
        Cookies.set('phone', address.phone);

        dispatch({ type: '[Cart] - Update Address', payload: address });
    }

    //metodo para crear una orden
    const createOrder = async (): Promise<{ hasError: boolean; message: string; }> => {

        if (!state.shippingAddress) {
            throw new Error('No hay dirección de entrega');
        }

        //la constante body sera lo que llegara al backend
        const body: IOrder = {
            //en orderItems hacemos un mapeo del state.cart, esparcimos todos los atributos
            //y en el size decimos con p.size! que siempre vamos a tener el size, si no hacemos 
            //esto da error proque en interfaces/cart el size es opcional y de esta manera 
            //confirmamos de que siempre viene
            orderItems: state.cart.map(p => ({
                ...p,
                size: p.size!
            })),
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subTotal: state.subTotal,
            tax: state.tax,
            total: state.total,
            isPaid: false,
        }

        try {

            //usamos axios importado arriba en api/tesloApi, hacemos un post a 
            //orders y mandamos el body creado arriba al backend
            //devuelve un IOrder en la data
            const { data } = await tesloApi.post<IOrder>('/orders', body);

            //hacemos el dispatch para borrar variables
            dispatch({ type:'[Cart] - Order complete'});

            //si todo sale bien devolvemos que hasError como false y en el message el id de la orden
            return {
                hasError: false,
                message: data._id! //confirmamos que siempre lo vamos a tener con !
            }

        } catch (error) {
            //si el fallo es de axios mostramos el error
            if (axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }
            //si es otro tipo de error
            return {
                hasError: true,
                message: 'Error no controlado, hable con el administrador'
            }
        }

    }

    return (
        //usamos el componente de Contexto(create Context) CartContext
        //definimos el value que es lo que se compartira con el resto de componentes
        //el children lo compondran los componentes incluidos en este Provider
        <CartContext.Provider value={{
            ...state,

            //Metodos
            addProductToCart,
            updateCartQuantity,
            removeCartProduct,
            updateAddress,

            //metodos de las ordenes
            createOrder,

        }}>
            { children}
        </CartContext.Provider>
    )
};