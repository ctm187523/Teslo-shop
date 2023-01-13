import NextLink from 'next/link'

import { Box, Button, CardActionArea, CardMedia, Grid, Typography } from '@mui/material';
import { ItemCounter } from '../ui';
import { FC, useContext } from 'react';
import { CartContext } from '../../context/cart/CartContext';
import { ICartProduct } from '../../interfaces/cart';



interface Props {
    editable?: boolean;
    products?: any;
}

export const CartList: FC<Props> = ({ editable = false, products}) => {

    //usamos useContext para obterner atributos y metodos del contexto CartContext
    const { cart, updateCartQuantity , removeCartProduct} = useContext(CartContext);

    //funcion para cambiar los valores del producto en la pagina del carrito
    const onNewQuantityValue = ( product: ICartProduct, newQuantityValue: number) => {

        product.quantity = newQuantityValue; //variamos la cantidad
        updateCartQuantity(product); //llamamos a la funcion obtenida arriba del contexto CartContext
    }

    //seleccionamos los productos a mostrar discriminando si vienen los productos por parametro o no 
    //si vienen por parametro vendrian de pages/orders/[id].tsx, si no viene lo tomamos del contexto CartContext
    const productsToSwow = products ? products : cart;

    return (
        <>
            {
                productsToSwow.map((product: any) => (
                    <Grid container spacing={2} sx={{ mb: 1 }} key={product.slug + product.size}> 
                        {/* dividimos los grid a lo ancho con 3,3 y 2  */}
                        <Grid item xs={3}>
                            {/* llevar a la pagina del producto */}
                            <NextLink href= { `/product/${ product.slug }`} passHref>
                                <CardActionArea>
                                    <CardMedia
                                        image={product.image }
                                        component='img'
                                        sx={{ borderRadius: '5px' }}
                                    />
                                </CardActionArea>
                            </NextLink>
                        </Grid>
                        <Grid item xs={7}>
                            <Box display='flex' flexDirection='column'>
                                <Typography variant='body1'> {product.title}</Typography>
                                <Typography variant='body1'>Talla: <strong> {product.size}</strong></Typography>

                                {/* Condicional si es editable, constante recivida por Props, mostramos el componente
                                ItemCounter en caso contrario el typography con la informacion*/}

                                {/* Importamos el ItemCounter de components/ui */}
                                {
                                    editable
                                        ? (

                                            <ItemCounter
                                                currentValue={product.quantity}
                                                maxValue={10} //le ponemos un valor para obtener las existencias del producto tendriamos que hacer una peticion al backend
                                                updateQuantity={ ( value ) => onNewQuantityValue ( product as ICartProduct, value)} //mandamos a la funcion el product para cambiar la nueva cantidad y el value que es valor que obtenemos de updateQuantity de components/ui/ItemCounter
                                            />
                                        )
                                        : (
                                            <Typography variant='h5'> { product.quantity } { product.quantity >1 ? 'productos' : 'producto'}</Typography>
                                        )


                                }


                            </Box>
                        </Grid>
                        <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                            <Typography variant='subtitle1' > {`$${product.price}`} </Typography>

                            {/* dependiendo de la condición editable recibida en las props el botón 
                            se muestra o no*/}
                            {
                                editable && (
                                    <Button 
                                    variant='text' 
                                    color='secondary'
                                    onClick = { () => removeCartProduct (product as ICartProduct)} //llamamos a la funcion del context CartContext importado arriba
                                    > Eliminar</Button>
                                )
                            }

                        </Grid>
                    </Grid>
                ))
            }
        </>
    )
}


