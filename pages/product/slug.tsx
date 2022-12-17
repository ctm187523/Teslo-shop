import { Button, Chip, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ShopLayout } from "../../components/layouts"
import { ProductsSlideshow, SizeSelector } from "../../components/products";
import { ItemCounter } from "../../components/ui";
import { initialData } from '../../database/products';

//para mostrar las imagenes slide-show he intalado un paquete con --> yarn add react-slideshow-image

const product = initialData.products[0];

const ProductPage = () => {
  return (
    <ShopLayout title={product.title} pageDescription={product.description} >

      <Grid container spacing={3}>

        {/* para pantallas pequeñas ocupa todo el espacio para no tan pequeñas 7 unidades */}
        <Grid item xs={12} sm={7}>
          {/* importamos el componente creado en components/products para mostrar las imagenes*/}
          <ProductsSlideshow
            images={product.images}
          />
        </Grid>

        {/* para pantallas pequeñas ocupa todo el espacio para no tan pequeñas las 5 unidades restantes de las 12 totales*/}
        <Grid item xs={12} sm={5}>

          <Box display='flex' flexDirection='column'>

            {/* ponemos las caracteristicas del producto */}
            <Typography variant='h1' component='h1'>{product.title}</Typography>
            <Typography variant='subtitle1' component='h2'>${product.price}</Typography>

            {/* cantidades */}
            <Box
              sx={{ my: 2 }} //my es para tanto como arriba para abajo un margen de el eje Y
            >
              <Typography variant='subtitle2'>Cantidad</Typography>

              {/* Item counter */}
              {/* usamos el componente creado en components/ui/ItemCounter*/}
              <ItemCounter />

              {/* colocamos el componete creada en components/products/SizeSelector
              para la seleccion de tallas*/}
              <SizeSelector
                //selectedSize={ product.sizes[ 0 ]} //como la talla seleccionada cojemos la primera posicion
                sizes={product.sizes}
              />
            </Box>

            {/* Agregar al carrito */}
            <Button
              color='secondary'
              className='circular-btn' //clase perteneciente a styles/globals.css
            >
              Agregar al carrito
            </Button>

            {/* Mostramos al cliente que no esta disponible usamos Chip de materia UI*/}
            {/* <Chip label="no hay disponibles" color="error" variant="outlined"/> */}

            {/* Descripcion */}
            <Box sx={{ mt: 3 }}>
              <Typography variant='subtitle2'>Descripcion</Typography>
              <Typography variant='body2'> {product.description} </Typography>
            </Box>

          </Box>
        </Grid>

      </Grid>

    </ShopLayout>
  )
}

export default ProductPage