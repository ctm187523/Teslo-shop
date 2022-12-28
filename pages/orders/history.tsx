
import NextLink from 'next/link';

import { Chip, Grid, Typography, Link} from '@mui/material';

import React from 'react';
import { ShopLayout } from '../../components/layouts';

//importamos el componente DataGrid que usamos en esta página lo hemos instalado de material UI
//con el siguiente comando --> yarn add @mui/x-data-grid
//ver documentacion en --> https://mui.com/x/react-data-grid/getting-started/#main-content
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';


//creamos la constante columns para el DataGrid importado arriba de tipo GridColDef
const columns: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 100 },
    { field: 'fullname', headerName: 'Nobre Completo', width: 300 },

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
                <NextLink href={`/orders/${params.row.id}`} passHref>
                    <Link underline='always'>
                        Ver orden
                    </Link>
                </NextLink>
            )
        }
    }
];

//creamos la constante rows para el DataGrid importado arriba de tipo GridColDef
const rows = [
    { id: 1, paid: true, fullname: 'Pepe Gutierrez' },
    { id: 2, paid: false, fullname: 'Paco Hernandez' },
    { id: 3, paid: true, fullname: 'Luis Garcia' },
    { id: 4, paid: true, fullname: 'Manolo Lopez' },
    { id: 5, paid: false, fullname: 'David Gonzalez' },
    { id: 6, paid: true, fullname: 'Maria Rojas' },
];

const HistoryPage = () => {
    return (
        <ShopLayout title={'Historial de ordenes'} pageDescription={'Historial de ordenes del cliente'}>
            <Typography variant='h1' component='h1'>Historial de ordenes</Typography>

            <Grid container>
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

export default HistoryPage;

