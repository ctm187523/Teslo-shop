import { Box, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products/ProductList';
import { GetServerSideProps, NextPage } from 'next';
import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces/products';

interface Props {
    products: IProduct[]; //tipamos las Props recibidas de la funcion de abajo serverSideProps
    foundProducts: boolean;
    query: string;
}

const searchPage: NextPage<Props> = ({ products, foundProducts, query }) => {



    return (
        <ShopLayout title={"Teslo-Shop - Search"} pageDescription={"Encuentra los mejores productos de Teslo aqui"} >

            {/* Es importante que sea h1 para el SEO para que sepan los buscadores que es el titulo de la pagina*/}
            <Typography variant="h1" component='h1'>Buscar productos</Typography>

            {
                foundProducts
                    ? <Typography variant="h2" sx={{ mb: 1 }} textTransform="capitalize">Término: {query}</Typography>
                    : (
                        <Box display='flex'>
                            <Typography variant="h2" sx={{ mb: 1 }}>No encontramos ningún producto</Typography>
                            <Typography variant="h2" sx={{ ml: 1 }} color="secondary" textTransform="capitalize">{query}</Typography>
                        </Box>
                    )
            }


            <ProductList products={products} />

        </ShopLayout>
    )

}

//usamos ServerSideRendering  para trabajar del lado del servidor, cuando alguien solicite
//esta pagina va a venir precargada con la informacion del lado del servidor, 
export const getServerSideProps: GetServerSideProps = async (ctx) => {

    //console.log(ctx.params); la salida es { query: 'cybertruck' } si la busqueda ha sido cybertruck

    //obtenemos el elemento de busqueda de la url, para ello usamos el parametro ctx(context), lo tipamos como string
    //sabemos que el params es query porque es como se llama la pagina si no viene ponemos un objeto vacio ''
    const { query = '' } = ctx.params as { query: string };

    //comprobamos que la query no venga vacia, si viene vacia redirigimos al home
    if (query.length === 0) {
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    //usamos de database/dbProducts la funcion getProductByTerm para obtner el producto a traves de la peticion del buscador
    //products lo usamos como una variable con let porque puede ser que no obtengamos ningun resultado en la busqueda y entonces 
    //querramos mandar otros productos 
    let products = await dbProducts.getProductsByTerm(query);

    //valor booleano, true si se ha encontrado un producto, false si no
    const foundProducts = products.length > 0;

    // TODO: retornar otros productos si no se encuentra lo buscado
    if (!foundProducts) {
        //usamos de database/dbProducts la funcion getAllProducts para obtener todos los productos en caso de no encontrar el producto deseado mediante el buscador
        //products = await dbProducts.getAllProducts();
        products = await dbProducts.getProductsByTerm('shirt');
    }

    return {
        //las props son enviadas a este componente ProductPage por parametros
        props: {
            products: products,
            foundProducts,
            query
        }
    }
}


export default searchPage;
