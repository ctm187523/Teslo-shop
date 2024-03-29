import { Grid, CardActionArea, CardMedia, Card, Box, Typography, Chip, Link } from "@mui/material";
import { FC, useMemo, useState } from "react";
import { IProduct } from '../../interfaces';
import NextLink from 'next/link';

interface Props {
    product: IProduct; //importamos el tipado de la interfaz interfaces/products.ts
}

export const ProductCard: FC<Props> = ({ product }) => {

    //usamos el Hook useState para saber si esta el mouse encima de la imagen Hover o no
    const [isHovered, setIsHovered] = useState(false);

    //usamos el useState para controlar la carga de la imagen y hacer que hasta que la imagen no esta cargada no se muestre el texto de descripcion de la imagen
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    //usamos el useMemo para memorizar el productImage como dependencia es el cambio del isHovered del useState de arriba
    // y el product.images. Si isHovered es true, el mouse esta encima de la imagen mostramos la imagen del array product.images
    //posicion 1 de la carpeta public/products si es false mostramos la posicion 0
    const productImage = useMemo(() => {
        return isHovered
            ? product.images[1]
            : product.images[0];

    }, [isHovered, product.images])

    return (
        // para pantalla pequeñas hacemos que sea de 6 que tome 2 y 2 ya que el maximo son 12 y para pantallas 
        //no tan pequeña que ocupe 4 3 y 3
        <Grid
            item xs={6} sm={4}
            onMouseEnter={() => setIsHovered(true)} //comprobamos en que imagen esta el Mouse
            onMouseLeave={() => setIsHovered(false)} //comprobamos de que imagen sale el Mouse
        >
            <Card>
                {/* usamos NextLink importado arriba para redirigir un producto seleccionado */}



                <NextLink href={`/product/${product.slug}`} passHref prefetch={false}>
                    <Link>
                        {/* colocamos un CardActionArea para que se pueda hacer click */}
                        <CardActionArea>
                            {/* componente que se visualiza cuando el producto no esta disponible 
                            creamos una condicion para que se muestre si el stock es cero*/}
                            {
                                (product.inStock === 0) && (
                                    <Chip
                                        color="primary"
                                        label="No hay disponibles"
                                        //ponemos la position absolute para que se muestre dentro del card, zIndex para que se muestre por encima
                                        sx={{ position: 'absolute', zIndex: 99, top: '10px', left: '10px' }}
                                    />
                                )
                            }

                            <CardMedia
                                component='img'
                                className='fadeIn'
                                image={productImage}
                                alt={product.title}
                                onLoad={() => setIsImageLoaded(true)}
                            />

                        </CardActionArea>
                    </Link>
                </NextLink>
            </Card>

            {/* ponemos los el titulo del producto y precio */}
            {/* usamos fadeIn de styles/globals.css que consiste en una animacion 
            ponemos una condicion de que si la imagen esta cargada(isImageLoaded) se muestre el contenido del Box*/}
            <Box sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }} className='fadeIn'>
                <Typography fontWeight={700}>{product.title}</Typography>
                <Typography fontWeight={500}>{`$${product.price}`}</Typography>
            </Box>
        </Grid>
    )
}
