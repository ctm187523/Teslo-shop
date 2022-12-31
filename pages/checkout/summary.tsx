import NextLink from 'next/link';

import { Box, Button, Card, CardContent, Divider, Grid, Typography, Link } from '@mui/material'
import React from 'react'
import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'
import { useContext } from 'react';
import { CartContext } from '../../context/cart/CartContext';
import { countries } from '../../utils';


const SummaryPage = () => {

    //usamos el contexto del CartContext
    const { numberOfItems, shippingAddress } = useContext(CartContext)

    //si el shippingAddress esta vacio
    if(!shippingAddress) {
        return <></>;
    }

    //desestructuramos los campos del shippingAddress

    const { firstName, lastName, address, address2 = '', city, country, phone, zip} = shippingAddress;
    
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
                            <Typography variant='h2'>Resumen ({ numberOfItems } { numberOfItems ===1 ? 'producto':'prouctos'})</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                                <NextLink href='/checkout/address' passHref>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <Typography>{ firstName} { lastName }</Typography>
                            <Typography>{ address } { address2 ? `,${address2}` : ''}</Typography>
                            <Typography>{ city} {shippingAddress?.zip}</Typography>
                            {/* Importamos el array de countries de utils/countries y con find buscamos el code
                            de cada elemento del array que sea igual al country del shippingAdress extraido del useContext*/}
                            <Typography>{ countries.find ( c => c.code === country)?.name}</Typography>
                            <Typography>{ phone}</Typography>

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
