import NextLink from 'next/link';

import { Box, Button, Card, CardContent, Divider, Grid, Typography, Link } from '@mui/material'
import React from 'react'
import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'


const SummaryPage = () => {
    return (
        <ShopLayout title='Resumen de orden' pageDescription="Resumen de la orden">

            <Typography variant='h1' component='h1'>Resumen de la orden</Typography>

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
                                {/* para el className usamos los estilos globales de styles/globals.css */}
                                <Button color="secondary" className='circular-btn' fullWidth>
                                    Confirmar Orden
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default SummaryPage;
