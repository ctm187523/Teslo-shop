import NextLink from 'next/link';

import { Box, Card, CardContent, Chip, Divider, Grid, Typography, Link } from '@mui/material'
import React from 'react'
import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';


const OrderPage = () => {
    return (
        <ShopLayout title='Resumen de orden 1234566' pageDescription="Resumen de la orden">

            <Typography variant='h1' component='h1'>Orden: ABC123</Typography>

            {/* Con los componentes Chip mostramos si estan o no pagada la factura */}
            {/* <Chip
                sx={{ my: 2 }}
                label="Pendiente de pago"
                variant='outlined'
                color='error'
                icon={<CreditCardOffOutlined />}
            /> */}

            <Chip
                sx={{ my: 2 }}
                label="Orden ya fue pagada"
                variant='outlined'
                color='success'
                icon={<CreditScoreOutlined />}
            />

            <Grid container>
                {/* definimos las medidas para tamaños pequeños y no tan pequeños */}
                <Grid item xs={12} sm={7}>
                    {/* Lista de productos en el carrito usamos el componente CartList de components/cart/CartList*/}
                    <CartList />
                </Grid>

                <Grid item xs={12} sm={5}>
                    {/* para el className usamos los estilos globales de styles/globals.css */}
                    <Card className='summary-card' >
                        <CardContent>
                            <Typography variant='h2'>Resumen (3 productos)</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                                <NextLink href='/checkout/address' passHref>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <Typography>Mariano Lopez</Typography>
                            <Typography>Calle Mayor 23</Typography>
                            <Typography>Barcelona 08898</Typography>
                            <Typography>España</Typography>
                            <Typography>+34 98747323</Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='end'>
                                <NextLink href='/cart' passHref>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>


                            {/* Resumen del pedido */}
                            {/* Usamos el componente creado OrderSummary creado en components/cart/CartList */}
                            <OrderSummary />

                            <Box sx={{ mt: 3 }}>
                                {/* Pagar el pedido */}
                                <h1>Pagar</h1>

                                <Chip
                                    sx={{ my: 2 }}
                                    label="Orden ya fue pagada"
                                    variant='outlined'
                                    color='success'
                                    icon={<CreditScoreOutlined />}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default OrderPage;
