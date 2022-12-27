
import { FC, useReducer, ReactElement, useEffect } from 'react';
import { CartContext, cartReducer } from './'
import { ICartProduct } from '../../interfaces/cart';

//he instalado para manejar las cookies desde el frontend --> yarn add js-cookie
//para el backend yo lo hace sin instalar nada
//para manejar este paquete de Cookies con typeScript he instalado --> yarn add -D @types/js-cookie
import Cookie from 'js-cookie';

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

    return (
        //usamos el componente de Contexto(create Context) CartContext
        //definimos el value que es lo que se compartira con el resto de componentes
        //el children lo compondran los componentes incluidos en este Provider
        <CartContext.Provider value={{
            ...state,

            //Metodos
            addProductToCart
        }}>
            { children}
        </CartContext.Provider>
    )
};