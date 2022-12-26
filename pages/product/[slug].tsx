
//para mostrar las imagenes slide-show he intalado un paquete con --> yarn add react-slideshow-image

import { Button, Chip, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ShopLayout } from "../../components/layouts"
import { ProductsSlideshow, SizeSelector } from "../../components/products";
import { ItemCounter } from "../../components/ui";
//import { initialData } from '../../database/products';
//import { useRouter } from 'next/router';
//import { useProducts } from '../../hooks/useProducts';
import { IProduct, ISize } from '../../interfaces/products';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';


import { dbProducts } from "../../database";
import { useState, useContext } from 'react';
import { ICartProduct } from '../../interfaces/cart';
import { useRouter } from "next/router";
import { CartContext } from '../../context/cart/CartContext';



//lo comentamos es lo que usamos para pruebas tomando uno de los productos en este caso el primero[0]
//const product = initialData.products[0];


interface Props {
  product: IProduct //tipamos los productos con la interfaz IProdecut de /interfaces/products
}

const ProductPage: NextPage<Props> = ({ product }) => {

  //COMENTAMOS el codigo de abajo para mostrar como se haria usando el useRouter, finalmente usamos getServerSideProps si lo hubieramos echo con lo comentado no tendriamos SEO
  //usamos el Hook de React useRouter para saber que slug se quiere mostrar recibimos por parametro el slug desde donde se envia components/products/ProductCard
  //const router = useRouter();

  //usamos el hook useProducts creado en hooks/useProducts para realizar un endPoint y recibir los datos de la base de datos
  //usamos en la ruta la informacion recibida arriba del useRouter
  // const { products: product, isLoading }  = useProducts(`/products/${router.query.slug}`);

  // if ( isLoading ) {
  //   return <h1>Cargando</h1>
  // }

  // if ( !product ){
  //   return <h1>No existe</h1>
  // }


  //usamos el Hook useRouter para redirigir a la pagina del carrito
   const router = useRouter(); 

   //usamos el contexto de CartContext creado en context/cart/CartContext
   const { addProductToCart } = useContext(CartContext)

  //usamos un useState tipado de tipo ICartProduct para controlar el estado del producto, el cliente puede
  //cambiar las tallas seleccionadas y las cantidades que desea del producto
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
      _id: product._id,
      image: product.images[0],
      price: product.price,
      size: undefined,
      slug: product.slug,
      title: product.title,
      gender: product.gender,
      quantity: 1,
  });

  //funcion para cambiar el estado de la talla seleccionada del producto usando el useState de arriba
  const selecteSize = ( size:ISize) => {
      //usamos del useState de arriba setTempCartProduct para modificar el objeto y poner como size 
      //la medida recibida de abajo del componente SizeSelector, currentProduct es el nombre aleatorio que hemos puesto al argumento
      setTempCartProduct( currentProduct => ({
        ...currentProduct,
        size:size
      }));
  }

  //funcion para cambiar el estado de las cantidades del producto usando el useState de arriba
  const onUpdateQuantiy = ( value:number) => {
     setTempCartProduct( currentProduct => ({
       ...currentProduct,
       quantity:value
     }))
  }

  //funcion para agregar un producto al carrito
  const onAddProduct = () => {

    if ( !tempCartProduct.size ) { return } // si no se ha seleccionado la talla no agregamos al carrito el producto

    //llamar la accion del context para agregar al carrito
    addProductToCart(tempCartProduct) // mandamos usando el metodo del context addProductToCart de CartContext el tempCartProduct del useState de arriba
    //router.push('/cart');
  }

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
              <ItemCounter 
                currentValue={ tempCartProduct.quantity} //pasamos el valor del useState tempCartProduct la cantidad por defecto que es 1
                updateQuantity= { (value) => onUpdateQuantiy(value)} //llamamos a la funcion creda arriba onUpdateQuantity para cambiar la cantidad en el estado del producto
                maxValue={ product.inStock > 10 ? 10 : product.inStock } //limitamos el maximo de productos a 10
              />

              {/* colocamos el componete creada en components/products/SizeSelector
              para la seleccion de tallas*/}
              <SizeSelector
                sizes={product.sizes} //le mandamos las medidas que tiene el producto
                selectedSize= { tempCartProduct.size } //ponemos como medida seleccionada la que tenemos en tempCartProduct del useState de arriba por defecto es undefined
                onSelectedSize = { (size) => selecteSize(size)} //le mandamos a la funcion selectedSize de arriba el boton pulsado recibido del onClick del componente SizeSelector.tsx en components/products
              />
            </Box>

            {/* creamos una condicion si existen productos el sstock es mayor que cero mostramos el boton
            de Agregar al carrito en caso contrario mostramos un componente Chip advirtiendo que no hay disponibles*/}
            {
              (product.inStock > 0)
                ? (
                  //Agregar al carrito 
                  <Button
                    color='secondary'
                    className='circular-btn' //clase perteneciente a styles/globals.css
                    onClick={ onAddProduct }
                  >
                    {
                      //hacemos que aparezca en el boton si no se ha seleccionado una talla un texto diciendo que debe seleccionar una talla antes de agregar al carrito
                      tempCartProduct.size
                        ? 'Agregar al carrito'
                        : 'Seleccione una talla'
                    }
                  </Button>

                )
                : (
                  //Mostramos al cliente que no esta disponible usamos Chip de materia UI
                  <Chip label="no hay disponibles" color="error" variant="outlined" />
                )
            }

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


//usamos ServerSideRendering  para trabajar del lado del servidor, cuando alguien solicite
//esta pagina va a venir precargada con la informacion del lado del servidor
//COMENTAMOS EL GetServerSideProps PORQUE LO CREAREMOS DE MANERA ESTATICA USANDO LOS getStaticsPaths y getStaticProps
// export const getServerSideProps: GetServerSideProps = async (ctx) => {

//   //obtenemos el slug del url del parametro ctx(context), lo tipamos como string
//   const { slug = ' '} = ctx.params as { slug: string };

//  //usamos de database/dbProducts la funcion getProductBySlug para obtner el producto a traves del slug
//  const product = await dbProducts.getProductBySlug( slug )

//   //si el product es null ya no recargamos la pagina y devolvemos con redirect que
//   //redireccione al inico
//   if (!product) {
//       return {
//           redirect: {
//               destination: '/',
//               permanent: false, //false porque la pagina puede seguir existiendo
//           }
//       }
//   }

//   return {
//       //las props son enviadas a este componente ProductPage por parametros
//       props: {
//           product: product
//       }
//   }
// }



//------------------------------------------------------------------------//

//manejamos las paginas con arugmento dinamico [slug]
//podemos usar getStaticPaths si estamos de manera estatica prerenderizando las paginas que usan rutas dinamicas [slug]
//esto se genera en el build de la aplicacion
export const getStaticPaths: GetStaticPaths = async (ctx) => {

  //obtenemos los slugs como objeto { slug: '' } usando la funcion getAllProductSlugs de database/dbProducts
  const productsSlugs = await dbProducts.getAllProductSlugs();

  return {
    //recorremos cada uno de los objetos obtenidos y en params creamos el objeto con el slug correspondiente
    paths: productsSlugs.map(object => ({

      params: { slug: object.slug }
    })),
    //fallback: false //con fallback false decimos que si la peticion es un id que no existe muestre error 404
    fallback: 'blocking' //usamos fallback en 'blocking' para decirle que nosotros hemos construido en build 151 paginas si alguien pide la 152 y existe la genere despues de haver echo el build ya en produccion usamos el Incremental Static Generation(ISG)

  }
}


//vamos a cargar el producto especifico seleccionado por el usuario de manera estática
//usamos el GetStaticProps de Next una vez carga arriba los paths con el metodo getStaticPaths
//generamos los props que tendra esta pagina, le pasamos los props a esta pagina ProductPage manejada como [slug].tsx para generar paginas dinamicamente
//en el build todas las paginas han sido cargadas en el lado del servidor estan ubicadas una vez echo el build en next/server/pages/product
export const getStaticProps: GetStaticProps = async (ctx) => {

  //leemos el ctx el contexto para recibir los parametros ctx.params donde obtenemos el slug de la pagina del producto seleccionado
  //lo tipamos con as { slug: string }, lo recibimos de la url, por si no viene informacion ponemos slug = '' por defecto
  const { slug = '' } = ctx.params as { slug: string };

  //usamos el metodo getProductBySlug de database/dbProducts para obtener el producto por su slug
  const product = await dbProducts.getProductBySlug(slug)

  //comprobamos si tenemos una respuesta del producto solicitado por slug usamos el Incremental Static Generation(ISG)
  //si no tenemos una respuesta satisfactoria redirigimos al home, no la hacemos permanente
  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    //las props colocadas aqui se mandan a las props de este mismo componente
    //le pasamos a este componente el resultado de la consulta ya preprocesada
    //y con todos los campos completos
    props: {
      //devolvemos la data que es toda la informacion del producto recibida de la request
      //para la request usamos el metodo getProductBySlug de database/dbProducts para obtener el producto por su slug
      product: product
    },
    //usamos el Incremental Static Regeneration(ISR), es opcional
    //lo usamos para decirle a Next que cada 60 segundos * 60 minutos * 24, es decir que cada dia se revalide la pagina
    //en total serian 86400 segundos que es los segundos de un dia estos valores se pueden modificar y ajustar a lo que deseemos
    //en este caso si al cambiar la data, la informacion de los Pokemons se actualizaria el contenido
    revalidate: 8640,
  }
}

export default ProductPage