import NextLink from 'next/link'

import { RemoveShoppingCartOutlined } from "@mui/icons-material";
import { Box, Typography, Link } from "@mui/material";
import { ShopLayout } from "../../components/layouts"


const EmptyPage = () => {


    return (
        <ShopLayout title="Carrito vacio" pageDescription="No hay artículos en el carrito de compras" >
            <Box
                display='flex'
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }} //en pantallas pequeñas hacemos que se vea en columnas el contenido en mayores en fila
                alignItems='center'
                justifyContent='center'
                height='calc(100vh - 200px)'
            >
                {/* importamos un icono */}
                <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
                <Box display='flex' flexDirection='column' alignItems='center'>
                    <Typography>Su carrito esta vacio</Typography>
                    <NextLink href='/' passHref>
                        <Link typography="h4" color='secondary'>
                            Regresar
                        </Link>
                    </NextLink>
                </Box>
            </Box>
        </ShopLayout>
    )
}


export default EmptyPage;
