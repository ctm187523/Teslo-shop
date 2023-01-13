
import NextLink from 'next/link';
import { AddOutlined, CategoryOutlined } from '@mui/icons-material';
import { Box, Button, CardMedia, Grid, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from 'swr';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { IProduct } from '../../interfaces/products';



//configuramos las columna
const columns: GridColDef[] = [
    {
        field: 'img',
        headerName: 'Foto',
        renderCell: ({ row }: GridValueGetterParams | any) => {

            return (
                //colocamos una etiqueta a de html para que si el usuario quiere ver la información
                //del producto haga click y aparezca otra pagina con el producto
                <a href={`/product/${row.slug}`} target="_blank" rel="noreferrer">
                    {/* mostramos el producto */}
                    <CardMedia
                        component='img'
                        alt={row.title}
                        className='fadeIn'
                        image={row.img} //tomamos la imagenes de la carpeta public
                    />
                </a>
            )
        }
    },
    {
        field: 'title',
        headerName: 'Título',
        width: 250,
        renderCell: ({ row }: GridValueGetterParams | any) => {

            //usamos NextLink importado arriba para editar el producto
            return (
                <NextLink href={`/admin/products/${row.slug}`} passHref>
                    <Link underline='always'>
                        {row.title}
                    </Link>
                </NextLink>
            )
        }
    },
    { field: 'gender', headerName: 'Género' },
    { field: 'type', headerName: 'Tipo' },
    { field: 'inStock', headerName: 'Inventario' },
    { field: 'price', headerName: 'Precio' },
    { field: 'sizes', headerName: 'Tallas', width: 250 },
];

const ProductsPage = () => {

    //usamos SWR para hacer el endpoint
    const { data, error } = useSWR<IProduct[]>('/api/admin/products');

    //si no hay data ni error quiere decir que esta cargando y mandamos un fragmento vacio
    if (!data && !error) return (<></>);

    const rows = data!.map(product => ({

        id: product._id,
        img: product.images[0],
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.inStock,
        price: product.price,
        sizes: product.sizes.join(', '), //el join nos sirve para separar las tallas con una coma y un espacio
        slug: product.slug,

    }));

    return (
        <AdminLayout
            title={`Productos (${data?.length})`}
            subTitle={'Mantenimiento de productos'}
            icon={<CategoryOutlined />}
        >

            <Box display='flex' justifyContent='end' sx={{ mb: 2 }}>

                <Button
                    startIcon={<AddOutlined />}
                    color="secondary"
                    href="/admin/products/new" //ponemos new para evaluar si vamos a crear un nuevo producto o lo vamos a actualizar
                >
                    Crear Producto
                </Button>
            </Box>

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

export default ProductsPage;
