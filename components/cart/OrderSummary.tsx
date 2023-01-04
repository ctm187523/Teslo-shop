import { Grid, Typography } from "@mui/material"
import { FC, useContext } from 'react';
import { CartContext } from '../../context/cart/CartContext';
import { summaryProps } from "../../pages/orders/[id]";
import { currency } from "../../utils";

interface Props {
    summary? : summaryProps;
}

export const OrderSummary:FC<Props>= ({ summary}) => {

    //usamos el contexto CarContext
    const { numberOfItems, subTotal, tax, total } = useContext(CartContext);

    //ponemos en una constante llamada context lo recibido del useContext de arriba
    const context = { numberOfItems, subTotal, tax, total }

    //seleccionamos la data a mostrar discriminando si vienen por parametro o no 
    //si vienen por parametro vendrian de pages/orders/[id].tsx, si no viene lo tomamos del contexto CartContext
    const dataToShow = summary ? summary : context

    return (
        <Grid container>
            {/* la medida siempre va a ser de 6 el espacio del ancho */}
            <Grid item xs={6}>
                <Typography>No. Productos</Typography>
            </Grid>

            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{ dataToShow.numberOfItems } { dataToShow.numberOfItems > 1 ? 'productos' : 'producto'}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>SubTotal</Typography>
            </Grid>

            <Grid item xs={6} display='flex' justifyContent='end'>
                {/* usamos el objeto currency importado arriba de utils/currency */}
                <Typography>{currency.format(dataToShow.subTotal)} </Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</Typography>
            </Grid>

            <Grid item xs={6} display='flex' justifyContent='end'>  {/* usamos el objeto currency importado arriba de utils/currency */}
                <Typography> {currency.format(dataToShow.tax)} </Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt: 2 }}>
                <Typography variant='subtitle1'>Total:</Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt: 2 }} display='flex' justifyContent='end'>
                {/* usamos el objeto currency importado arriba de utils/currency */}
                <Typography> {currency.format(dataToShow.total)}</Typography>
            </Grid>
        </Grid>
    )
}


