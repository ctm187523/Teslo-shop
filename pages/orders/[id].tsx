
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material'
import React from 'react'
import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces/order';

interface Props {
    order: IOrder;
}

//interface para los valores que exportaremos para el componente de abajo OrderSummary
export interface summaryProps {
    tax: number,
    total: number,
    numberOfItems: number,
    subTotal: number,
}


//recibimos las props de abajo de la funcion getServerSideProps
const OrderPage: NextPage<Props> = ({ order }) => {

    //desestructuramos de order recibido del getServerSideProps
    const { shippingAddress, tax, total, numberOfItems, subTotal } = order

    //creamos un objeto de tipo de la interfaz creada arriba para mandarla abajo en el componente OrderSummary
    const summary: summaryProps = { tax, total, numberOfItems, subTotal }

    return (
        <ShopLayout title='Resumen de orden' pageDescription="Resumen de la orden">

            <Typography variant='h1' component='h1'>Orden: {order._id}</Typography>

            {
                order.isPaid
                    ? (

                        <Chip
                            sx={{ my: 2 }}
                            label="Orden ya fue pagada"
                            variant='outlined'
                            color='success'
                            icon={<CreditScoreOutlined />}
                        />

                    ) :
                    (
                        <Chip
                            sx={{ my: 2 }}
                            label="Pendiente de pago"
                            variant='outlined'
                            color='error'
                            icon={<CreditCardOffOutlined />}
                        />
                    )
            }


            <Grid container className='fadeIn'>
                {/* definimos las medidas para tamaños pequeños y no tan pequeños */}
                <Grid item xs={12} sm={7}>
                    {/* Lista de productos en el carrito usamos el componente CartList de components/cart/CartList
                    le pasamos editable en false que es el que esta por defecto o sea no le pasamos nada para que no se pueda editar le pasamos los productos*/}
                    <CartList products={order.orderItems} />
                </Grid>

                <Grid item xs={12} sm={5}>
                    {/* para el className usamos los estilos globales de styles/globals.css */}
                    <Card className='summary-card' >
                        <CardContent>
                            <Typography variant='h2'>Resumen ({order.numberOfItems} {order.numberOfItems > 1 ? 'productos' : 'producto'})</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            </Box>

                            <Typography>{shippingAddress.firstName} {shippingAddress.lastName}</Typography>
                            <Typography>{shippingAddress.address} {shippingAddress.address2 ? `, ${shippingAddress.address2}` : ''}</Typography>
                            <Typography>{shippingAddress.city} {shippingAddress.zip}</Typography>
                            <Typography>{shippingAddress.country}</Typography>
                            <Typography>{shippingAddress.phone}</Typography>

                            <Divider sx={{ my: 1 }} />


                            {/* Resumen del pedido */}
                            {/* Usamos el componente creado OrderSummary creado en components/cart/CartList */}
                            <OrderSummary summary={summary} />

                            <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                                {/* Pagar el pedido */}
                                {
                                    order.isPaid
                                        ? (
                                            <Chip
                                                sx={{ my: 2 }}
                                                label="Orden ya fue pagada"
                                                variant='outlined'
                                                color='success'
                                                icon={<CreditScoreOutlined />}
                                            />
                                        ) : (
                                            <h1>Pagar</h1>
                                        )
                                }

                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}


//usamos ServerSideRendering  para trabajar del lado del servidor, cuando alguien solicite
//esta pagina va a venir precargada con la informacion del lado del servidor, 
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    //obtenemos el id del query del contexto(ctx) desestructurado en los atributos arriba
    const { id = '' } = query;

    //usamos getSession de next auth para recuperar la session si existe, comprobamos que este logueado el usuario
    const session: any = await getSession({ req });

    //si no hay una session, no esta logueado mandamos al login
    if (!session) {
        return {
            redirect: {
                //redirigimos al login mandando en la query la direccion donde nos encontramos
                destination: `/auth/login?p=/orders/${id}`,
                permanent: false,
            }
        }
    }

    //si tenemos session comprobamos que la orden exista, pedimos la orden al metodo dbOrders de database/dbOrders
    const order = await dbOrders.getOrderById(id.toString());

    //si no existe una orden
    if (!order) {
        return {
            redirect: {
                //redirigimos a /orders/history
                destination: '/orders/history',
                permanent: false,
            }
        }
    }

    //comprobamos que la orden sea del usuario que lanzo esa orden para que nadie pueda verla excepto el que la realizo
    if (order.user !== session.user._id) {
        return {
            redirect: {
                //redirigimos a /orders/history
                destination: '/orders/history',
                permanent: false,
            }
        }
    }





    //si todo esta bien regresamos la order en las props
    return {
        //las props son enviadas a este componente ProductPage por parametros
        props: {
            order
        }
    }
}

export default OrderPage;
