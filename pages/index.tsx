import { Typography } from "@mui/material";
import { NextPage } from "next"
import { ShopLayout } from "../components/layouts";
import { ProductList } from '../components/products/ProductList';
import { useProducts } from '../hooks/useProducts';
import { FullScreenLoading } from '../components/ui';



const HomePage: NextPage = () => {

  //usamos el hook useProducts creado en hooks/useProducts mandandole por argumento la url, el endpoint
  //que queremos usar similar a axios
  const { products, isLoading } = useProducts('/products');

  return (
    <ShopLayout title={"Teslo-Shop - Home"} pageDescription={"Encuentra los mejores productos de Teslo aqui"} >

      {/* Es importante que sea h1 para el SEO para que sepan los buscadores que es el titulo de la pagina*/}
      <Typography variant="h1" component='h1'>Tienda</Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>Todos los productos</Typography>

      {/* mostramos los productos en caso de que isLoading sea false importando el funcional component ProductList de ../components/products/ProductList 
       obtenemos los productos de <--initialData as any ubicado en el archivo database/products -->
       ya no obtenemos los productos del initialData ahora los obtenemos de la base de datos
       con products obtenida del hook de arriba usePriducts de hooks/useProducts
       si isLoading es true mostramos el componente FullScreenLoading creado en components/ui/FullScreenLoading*/}

      {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={products} />
      }

    </ShopLayout>
  )
}

export default HomePage;
