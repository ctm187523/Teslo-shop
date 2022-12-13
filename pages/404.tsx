
//pagina para mostrar el error 404 personalizado unicamente hemos puesto en el directorio
//pages el archivo 404.tsx y en caso de producirse ese error muestra el contenido de esta
//pagina

import { ShopLayout } from "../components/layouts";
import { Box, Typography } from '@mui/material';

const Custom404 = () => {
    return (
        <ShopLayout title='Page not found' pageDescription='no hay nada que mostrar aquí' >
            <Box
                display='flex'
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }} //en pantallas pequeñas hacemos que se vea en columnas el contenido en mayores en fila
                alignItems='center'
                justifyContent='center'
                height='calc(100vh - 200px)'
            >
                <Typography variant='h1' component='h1' fontSize={80} fontWeight={200}>404 |</Typography>
                <Typography marginLeft={2}>No encontramos ninguna página aquí</Typography>
            </Box>
        </ShopLayout>
    )
}

export default Custom404;