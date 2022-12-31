import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import React from 'react'
import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'
import { useContext, useEffect } from 'react';
import { CartContext } from '../../context/cart/CartContext';
import { useRouter } from 'next/router';


const CartPage = () => {

    //usamos el contexto CartContext
    const { isLoaded, cart } = useContext(CartContext);

    const router = useRouter();

    //usamos un useEffect para que al cargar la pagina compruebe si el isLoaded recibido del context CartContext
    //si el isLoaded esta en true nos dice que ha cargado las cookies y si el carrito esta vacio lo sacamos de la
    //pagina del carrito, las dependencias son si el isLoaded cambia de valor y si el carrito cambia y tambien
    //si el router cambiara
    useEffect(() => {

        if (isLoaded && cart.length === 0) {
            router.replace("/cart/empty");
        }
    }, [isLoaded, cart, router])

    //si el isLoaded esta en false es decir aun no se ha cargado o el carrrito esta vacio 
    //devolvemos un fragmento vacio para que no renderize la pagina del carrito 
    if (!isLoaded || cart.length === 0) {
        return (<></>);
    }

    return (
        <ShopLayout title='Carrito - 3' pageDescription="Carrito de compras de la tienda">

            <Typography variant='h1' component='h1'>Carrito</Typography>

            <Grid container>
                {/* definimos las medidas para tamaños pequeños y no tan pequeños */}
                <Grid item xs={12} sm={7}>
                    {/* Lista de productos en el carrito usamos el componente CartList de components/cart/CartList*/}
                    <CartList editable />
                </Grid>

                <Grid item xs={12} sm={5}>
                    {/* para el className usamos los estilos globales de styles/globals.css */}
                    <Card className='summary-card' >
                        <CardContent>
                            <Typography variant='h2'>Orden</Typography>
                            <Divider sx={{ my: 1 }} />

                            {/* Resumen del pedido */}
                            {/* Usamos el componente creado OrderSummary creado en components/cart/CartList */}
                            <OrderSummary />

                            <Box sx={{ mt: 3 }}>
                                {/* para el className usamos los estilos globales de styles/globals.css */}
                                <Button
                                    color="secondary"
                                    className='circular-btn'
                                    fullWidth
                                    href='/checkout/address' 
                                >
                                    CkeckOut
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default CartPage;
