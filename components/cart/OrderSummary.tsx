import { Grid, Typography } from "@mui/material"
import { useContext } from 'react';
import { CartContext } from '../../context/cart/CartContext';
import { currency } from "../../utils";


export const OrderSummary = () => {

    //usamos el contexto CarContext
    const { numberOfItems, subTotal, tax, total } = useContext(CartContext);


    return (
        <Grid container>
            {/* la medida siempre va a ser de 6 el espacio del ancho */}
            <Grid item xs={6}>
                <Typography>No. Productos</Typography>
            </Grid>

            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{numberOfItems} {numberOfItems > 1 ? 'productos' : 'producto'}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>SubTotal</Typography>
            </Grid>

            <Grid item xs={6} display='flex' justifyContent='end'>
                {/* usamos el objeto currency importado arriba de utils/currency */}
                <Typography>{currency.format(subTotal)} </Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</Typography>
            </Grid>

            <Grid item xs={6} display='flex' justifyContent='end'>  {/* usamos el objeto currency importado arriba de utils/currency */}
                <Typography> {currency.format(tax)} </Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt: 2 }}>
                <Typography variant='subtitle1'>Total:</Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt: 2 }} display='flex' justifyContent='end'>
                {/* usamos el objeto currency importado arriba de utils/currency */}
                <Typography> {currency.format(total)}</Typography>
            </Grid>
        </Grid>
    )
}


