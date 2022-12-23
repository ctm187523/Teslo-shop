import { Box, CircularProgress, Typography } from "@mui/material"

export const FullScreenLoading = () => {
    return (
        <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            height='calc(100vh - 200px)'
        >
            <Typography sx={{ mb:3 }} variant="h2" fontWeight={ 200 } fontSize= { 20 }>Cargando...</Typography>
            {/* usamos CircularProgress de material para el circulo de carga con thickness definimos el grosor dela linea del  circulo */}
            <CircularProgress thickness={ 2 }/>
        </Box>
    )
}
