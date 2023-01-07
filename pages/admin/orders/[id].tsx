import { GetServerSideProps, NextPage } from 'next';
import { dbOrders } from '../../../database';
import { IOrder } from '../../../interfaces';
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { CartList, OrderSummary } from '../../../components/cart';
import React from 'react';
import { AdminLayout } from '../../../components/layouts/AdminLayout';


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


const OrderPage: NextPage<Props> = ({ order }) => {

    //desestructuramos de order recibido del getServerSideProps
    const { shippingAddress, tax, total, numberOfItems, subTotal } = order;

    //creamos un objeto de tipo de la interfaz creada arriba para mandarla abajo en el componente OrderSummary
    const summary: summaryProps = { tax, total, numberOfItems, subTotal }



    return (

        <AdminLayout
            title='Resumen de la orden'
            subTitle={`OrdenId: ${order._id}`}
            icon={ <AirplaneTicketOutlined />}
            >

            {
                order.isPaid
                    ? (
                        <Chip
                            sx={{ my: 2 }}
                            label="Orden ya fue pagada"
                            variant='outlined'
                            color="success"
                            icon={<CreditScoreOutlined />}
                        />
                    ) :
                    (
                        <Chip
                            sx={{ my: 2 }}
                            label="Pendiente de pago"
                            variant='outlined'
                            color="error"
                            icon={<CreditCardOffOutlined />}
                        />
                    )
            }

            <Grid container className='fadeIn'>
                <Grid item xs={12} sm={7}>
                    <CartList products={order.orderItems} />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen ({order.numberOfItems} {order.numberOfItems > 1 ? 'productos' : 'producto'})</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            </Box>

                            <Typography>{shippingAddress.firstName} {shippingAddress.lastName}</Typography>
                            <Typography>{shippingAddress.address} {shippingAddress.address2 ? `, ${shippingAddress.address2}` : ''}</Typography>
                            <Typography>{shippingAddress.city}, {shippingAddress.zip}</Typography>
                            <Typography>{shippingAddress.country}</Typography>
                            <Typography>{shippingAddress.phone}</Typography>

                            <Divider sx={{ my: 1 }} />


                            {/* Usamos el componente creado OrderSummary creado en components/cart/CartList */}
                            <OrderSummary summary={summary} />

                            <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                                <Box display="flex" flexDirection='column' >
                                    {
                                        order.isPaid
                                            ? (
                                                <Chip
                                                    sx={{ my: 2, flex: 1 }}
                                                    label="Orden ya fue pagada"
                                                    variant='outlined'
                                                    color="success"
                                                    icon={<CreditScoreOutlined />}
                                                />

                                            ) : (
                                                <Chip
                                                    sx={{ my: 2, flex: 1 }}
                                                    label="Pendiente de pago"
                                                    variant='outlined'
                                                    color="error"
                                                    icon={<CreditCardOffOutlined />}
                                                />
                                            )
                                    }
                                </Box>
                            </Box>


                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </AdminLayout>

    )
}






//usamos ServerSideRendering  para trabajar del lado del servidor, cuando alguien solicite
//esta pagina va a venir precargada con la informacion del lado del servidor, 
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    //obtenemos el id del query del contexto(ctx) desestructurado en los atributos arriba
    const { id = '' } = query;

    //pedimos la orden al metodo dbOrders de database/dbOrders
    const order = await dbOrders.getOrderById(id.toString());

    //si no existe una orden
    if (!order) {
        return {
            redirect: {
                //redirigimos a /orders/history
                destination: '/admin/orders',
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
