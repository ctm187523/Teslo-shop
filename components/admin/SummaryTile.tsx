import { FC } from "react";
import { Card, CardContent, Grid, Typography } from '@mui/material';

interface Props {
    title: string | number;
    subTitle: string;
    icon: JSX.Element;
}

//componente que crea las tarjetas para el Dashboard
export const SummaryTile:FC<Props> = ( { title, subTitle, icon}) => {
    return (
        //mostramos la tarjeta segun el tamaño del dispositivo
        <Grid item xs={12} sm={4} md={3}>
        {/* con el display flex ponemos los componente uno al lado del otro ya que por defecto 
        flexDirection es en filas row */}
        <Card sx={{ display:'flex'}}>
            <CardContent sx={{ width: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {/* con fontsize ponemos el tamaño del icono */}
                {/* <CreditCardOffOutlined color="secondary" sx={{ fontSize: 40 }} /> */}
                { icon }
            </CardContent>
            <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h3'>{ title }</Typography>
                <Typography variant='caption'>{ subTitle }</Typography>
            </CardContent>
        </Card>
    </Grid>
    )
}
