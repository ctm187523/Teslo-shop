
import NextLink from 'next/link';

import { Chip, Grid, Typography, Link} from '@mui/material';

import React from 'react';
import { ShopLayout } from '../../components/layouts';

//importamos el componente DataGrid que usamos en esta página lo hemos instalado de material UI
//con el siguiente comando --> yarn add @mui/x-data-grid
//ver documentacion en --> https://mui.com/x/react-data-grid/getting-started/#main-content
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces/order';


//creamos la constante columns para el DataGrid importado arriba de tipo GridColDef
const columns: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 100 },
    { field: 'fullname', headerName: 'Nombre Completo', width: 300 },

    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Muestra la informacion si está pagada o no',
        width: 200,
        renderCell: (params) => {
            return (
                params.row.paid
                    ? <Chip color='success' label='Pagada' variant='outlined' />
                    : <Chip color='error' label='No pagada' variant='outlined' />
            )
        }
    },
    {
        field: 'orden',
        headerName: 'Ver orden',
        width: 200,
        sortable: false, //quita la flecha para ordenar el listado de filas
        renderCell: (params) => {
            return (
                <NextLink href={`/orders/${params.row.orderId}`} passHref>
                    <Link underline='always'>
                        Ver orden
                    </Link>
                </NextLink>
            )
        }
    }
];


interface Props {
    orders: IOrder[];
}

const HistoryPage:NextPage<Props> = ({ orders }) => {

    //creamos la constante rows para el DataGrid importado arriba de tipo GridColDef
    const rows = orders.map( (order,index) => ({
        id: index +1,
        paid: order.isPaid,
        fullname: `${ order.shippingAddress.firstName} ${ order.shippingAddress.lastName}`,
        orderId: order._id
    }))
       
            
    return (
        <ShopLayout title={'Historial de ordenes'} pageDescription={'Historial de ordenes del cliente'}>
            <Typography variant='h1' component='h1'>Historial de ordenes</Typography>

            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    {/* usamos el DataGrid  de Material UI importado arriba */}
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />
                </Grid>

            </Grid>
        </ShopLayout>


    )
}

//usamos ServerSideRendering  para trabajar del lado del servidor, cuando alguien solicite
//esta pagina va a venir precargada con la informacion del lado del servidor, 
export const getServerSideProps: GetServerSideProps = async ({ req }) => {

    //usamos la funcion getSession de next auth
    const session:any = await getSession({ req })

    //si no existe una session, no esta logueado lo mandamos al login con el query de donde nos encontramos
    if ( !session ) {
        return {
            redirect: {
                destination: '/auth/login?p=/orders/history',
                permanent: false
            }
        }
    }

    //usamos el metodo getOrderByUser de database/dbOrders para pedir todas las ordenes que estan relacionadas con un cliente
    const orders = await dbOrders.getOrdersByUser( session.user._id);
 
    return {
        //las props son enviadas a este componente ProductPage por parametros
        props: {
          orders
        }
    }
}

export default HistoryPage;

