import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material'
import React from 'react'
import { CartList, OrderSummary} from '../../components/cart'
import { ShopLayout } from '../../components/layouts'


const CartPage = () => {
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
                                <Button color="secondary" className='circular-btn' fullWidth>
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
