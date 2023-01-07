
import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from 'swr';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { IOrder, IUser } from '../../interfaces';


//configuramos las columna
const columns:GridColDef[] = [
    { field: 'id', headerName: 'Orden ID', width: 250},
    { field: 'email', headerName: 'Correo', width: 250},
    { field: 'name', headerName: 'Nombre Completo', width: 300},
    { field: 'total', headerName: 'Monto total', width: 300},
    {
        field: 'isPaid',
        headerName: 'Pagada',
        //la variable row la cogemos de las filas dependiendo si esta pagada la factura
        //o no mostramos un chip de pagado o pendiente
        renderCell: ({ row }: GridValueGetterParams | any) => {
            return row.isPaid 
                ? ( <Chip variant='outlined' label="Pagada" color="success"/> )
                : ( <Chip variant='outlined' label="Pendiente" color="error"/> )
        }
    },
    { field: 'noProducts', headerName: 'No.productos', align:'center', width: 150},
    {
        field: 'check',
        headerName: 'Ver orden',
        //la variable row la cogemos de las filas dependiendo si esta pagada la factura
        //o no mostramos un chip de pagado o pendiente
        renderCell: ({ row }: GridValueGetterParams | any) => {
            return (
                //ponemos una etiqueta a de html para hacer referencia a un endpoint
                <a href={ `/admin/orders/${ row.id }`} target="_blank" rel="noreferrer">
                    Ver orden
                </a>
            )
        }
    },
    { field: 'createdAt', headerName: 'Creada en', width: 300},
];

const OrdersPage = () => {

    //usamos SWR para hacer el endpoint
    const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

    //si no hay data ni error quiere decir que esta cargando y mandamos un fragmento vacio
    if ( !data && !error) return (<></>);

    const rows = data!.map( order => ({
        id: order._id,
        email: (order.user as IUser).email,
        name: (order.user as IUser).name,
        total: order.total,
        isPaid: order.isPaid,
        noProducts: order.numberOfItems,
        createdAt:order.createdAt,
    }));

    return (
        <AdminLayout
            title={'Ordenes'}
            subTitle={'Mantenimiento de ordenes'}
            icon={<ConfirmationNumberOutlined />}
        >

            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />

                </Grid>
            </Grid>

        </AdminLayout>
    )
}

export default OrdersPage;
