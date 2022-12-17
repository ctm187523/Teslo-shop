import { Grid, Typography } from "@mui/material"


export const OrderSummary = () => {
    return (
        <Grid container>
            {/* la medida siempre va a ser de 6 el espacio del ancho */}
            <Grid item xs={6}>
                <Typography>No. Productos</Typography>
            </Grid>

            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>3 items</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>SubTotal</Typography>
            </Grid>

            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{ `$${ 155.36 }`}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>Impuestos (21%)</Typography>
            </Grid>

            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{ `$${ 35.34 }`}</Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt:2 }}>
                <Typography  variant='subtitle1'>Total:</Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt:2 }} display='flex' justifyContent='end'>
                <Typography>{ `$${ 186.34 }`}</Typography>
            </Grid>
        </Grid>
    )
}


