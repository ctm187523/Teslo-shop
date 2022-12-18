import NextLink from 'next/link'

import { Box, Button, CardActionArea, CardMedia, Grid, Typography } from '@mui/material';
import { initialData } from '../../database/products';
import { ItemCounter } from '../ui';
import { FC } from 'react';

const productsInCart = [
    initialData.products[0],
    initialData.products[1],
    initialData.products[2],
]

interface Props {
    editable?: boolean;
}

export const CartList: FC<Props> = ({ editable = false }) => {
    return (
        <>
            {
                productsInCart.map(product => (
                    <Grid container spacing={2} sx={{ mb: 1 }} key={product.slug}>
                        {/* dividimos los grid a lo ancho con 3,3 y 2  */}
                        <Grid item xs={3}>
                            {/* llevar a la pagina del producto */}
                            <NextLink href="/product/slug" passHref>
                                <CardActionArea>
                                    <CardMedia
                                        image={`/products/${product.images[0]}`}
                                        component='img'
                                        sx={{ borderRadius: '5px' }}
                                    />
                                </CardActionArea>
                            </NextLink>
                        </Grid>
                        <Grid item xs={7}>
                            <Box display='flex' flexDirection='column'>
                                <Typography variant='body1'> {product.title}</Typography>
                                <Typography variant='body1'>Talla: <strong>M</strong></Typography>

                                {/* Condicional si es editable, constante recivida por Props, mostramos el componente
                                ItemCounter en caso contrario el typography con la informacion*/}

                                {/* Importamos el ItemCounter de components/ui */}
                                {
                                    editable
                                        ? <ItemCounter />
                                        : <Typography variant='h5'>3 items</Typography>
                                }


                            </Box>
                        </Grid>
                        <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                            <Typography variant='subtitle1' > {`$${product.price}`} </Typography>

                            {/* dependiendo de la condición editable recibida en las props el botón 
                            se muestra o no*/}
                            {
                                editable && (
                                    <Button variant='text' color='secondary'> Remover</Button>
                                )
                                   
                            }

                        </Grid>
                    </Grid>
                ))
            }
        </>
    )
}


