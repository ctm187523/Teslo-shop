import NextLink from 'next/link';

import { Box, Button, Card, CardContent, Divider, Grid, Typography, Link, Chip } from '@mui/material'
import React from 'react'
import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../context/cart/CartContext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const SummaryPage = () => {

    const router = useRouter();
    //usamos el contexto del CartContext
    const { numberOfItems, shippingAddress, createOrder } = useContext(CartContext);

    //useState para controlar si se ha mandado una order para que no se puedan mandar mas de una orden
    const [isPosting, setIsPosting] = useState(false);
    //useState para manejar el mostrar o no los errores
    const [errorMessage, setErrorMessage] = useState('');

    //con el useEffect nos aseguramos que haya un firstame en las Cookies eso quiere decir
    //que ha echo anteriormente el shippingAdress insertando las direcciones de envio
    // en checkout/address, como dependencia ponemos el router
    useEffect(() => {

        //si en las Cookies no esta el firstname lo dirigimos a checkout/address
        if (!Cookies.get('firstName')) {
            router.push('/checkout/address');
        }
    }, [router])


    //metodo para crear una order usando createOrder del Contexto CartContext 
    const onCreateOrder = async() => {
        setIsPosting(true);

        const { hasError, message } = await createOrder(); //llamamos y desestructuramos al metodo createOrder() del contexto CartContext

        //si hay un error setIsPosting lo ponemos en false para volver a habilitar el boton
        //y en setErrorMessage ponemos el error que recibimos de la llamada al metodo createOrder
        if ( hasError ) {
            setIsPosting(false);
            setErrorMessage( message );
            return;
        }

        //si todo va bien redirigimos
        router.replace(`/orders/${ message}`);
    }

    //si el shippingAddress esta vacio
    if (!shippingAddress) {
        return <></>;
    }

    //desestructuramos los campos del shippingAddress
    const { firstName, lastName, address, address2 = '', city, country, phone, zip } = shippingAddress;

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
                            <Typography variant='h2'>Resumen ({numberOfItems} {numberOfItems === 1 ? 'producto' : 'prouctos'})</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                                <NextLink href='/checkout/address' passHref>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <Typography>{firstName} {lastName}</Typography>
                            <Typography>{address} {address2 ? `,${address2}` : ''}</Typography>
                            <Typography>{city} {shippingAddress?.zip}</Typography>
                            {/* Importamos el array de countries de utils/countries y con find buscamos el code
                            de cada elemento del array que sea igual al country del shippingAdress extraido del useContext*/}
                            {/* <Typography>{ countries.find ( c => c.code === country)?.name}</Typography> */}
                            <Typography> {country}</Typography>
                            <Typography>{phone}</Typography>

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

                            <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                                {/* para el className usamos los estilos globales de styles/globals.css */}
                                <Button
                                    color="secondary"
                                    className='circular-btn'
                                    fullWidth
                                    onClick={onCreateOrder}
                                    disabled={ isPosting } //usamos el useState de arriba para indicar que si es true el boton esta desabilitado
                                >
                                    Confirmar Orden
                                </Button>

                                {/* usamos el componenete Chip para mostrar errores */}
                                <Chip
                                    color="error"
                                    label= { errorMessage}
                                    sx={{  display: errorMessage ? 'flex' : 'none', mt:2} }
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default SummaryPage;
