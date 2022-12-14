import { Grid, CardActionArea, CardMedia, Card, Box, Typography } from "@mui/material";
import { FC, useMemo, useState } from "react";
import { IProduct } from '../../interfaces';
import NextLink from 'next/link';

interface Props {
    product: IProduct; //importamos el tipado de la interfaz interfaces/products.ts
}

export const ProductCard: FC<Props> = ({ product }) => {

    //usamos el Hook useState para saber si esta el mouse encima de la imagen Hover o no
    const [isHovered, setIsHovered] = useState(false);

    //usamos el useMemo para memorizar el productImage como dependencia es el cambio del isHovered del useState de arriba
    // y el product.images. Si isHovered es true, el mouse esta encima de la imagen mostramos la imagen del array produect.images
    //posicion 1 de la carpeta public/products si es false mostramos la posicion 0
    const productImage = useMemo(() => {
        return isHovered
            ? `products/${product.images[1]}`
            : `products/${product.images[0]}`

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
                <NextLink href="product/slug" passHref prefetch={ false } style={{ textDecoration: 'none'}}>
                    {/* colocamos un CardActionArea para que se pueda hacer click */}
                    <CardActionArea>
                        <CardMedia
                            component='img'
                            //usamos para mostrar la imagen el Hook useMemo de arriba
                            image={productImage}
                            alt={product.title}
                            className='fadeIn' //usamos fadeIn de styles/globals.css que consiste en una animacion
                        //onLoad={ () => console.log('cargo')} //se puede usar para cargar un spinner mientras la imagen carga
                        />
                    </CardActionArea>
                </NextLink>
            </Card>

            {/* ponemos los el titulo del producto y precio */}
            {/* usamos fadeIn de styles/globals.css que consiste en una animacion */}
            <Box sx={{ mt: 1 }} className='fadeIn'>
                <Typography fontWeight={700}>{product.title}</Typography>
                <Typography fontWeight={500}>{`$${product.price}`}</Typography>
            </Box>
        </Grid>
    )
}
