import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { useProducts } from '../../hooks/useProducts';
import { FullScreenLoading } from '../../components/ui/FullScreenLoading';
import { ProductList } from '../../components/products';


const WomenPage = () => {

    //usamos el hook useProducts creado en hooks/useProducts mandandole por argumento la url, el endpoint
    //que queremos usar similar a axios
    const { products, isLoading } = useProducts('/products?gender=women');
    
    return (
        <ShopLayout title={"Teslo-Shop - Women"} pageDescription={"Encuentra los mejores productos de Teslo para mujeres"} >

            {/* Es importante que sea h1 para el SEO para que sepan los buscadores que es el titulo de la pagina*/}
            <Typography variant="h1" component='h1'>Mujer</Typography>
            <Typography variant="h2" sx={{ mb: 1 }}>Productos para ellas</Typography>

            {/* mostramos los productos en caso de que isLoading sea false importando el funcional component ProductList de ../components/products/ProductList 
             obtenemos los productos del hook de arriba useProducts de hooks/useProducts
             si isLoading es true mostramos el componente FullScreenLoading creado en components/ui/FullScreenLoading*/}

            {
                isLoading
                    ? <FullScreenLoading />
                    : <ProductList products={products} />
            }

        </ShopLayout>
    )
}

export default WomenPage;
