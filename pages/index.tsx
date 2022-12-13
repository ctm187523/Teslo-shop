import { Typography } from "@mui/material";
import { NextPage } from "next"
import { ShopLayout } from "../components/layouts";

const Home: NextPage = () => {
  return (
    <ShopLayout title={"Teslo-Shop - Home"} pageDescription={"Encuentra los mejores productos de Teslo aqui"} >
      {/* Es importante que sea h1 para el SEO para que sepan los buscadores que es el titulo de la pagina*/}
      <Typography variant="h1" component='h1'>Tienda</Typography>
      <Typography variant="h2" sx={{ mb:1 }}>Todos los productos</Typography>
    </ShopLayout>
  )
}

export default Home;
