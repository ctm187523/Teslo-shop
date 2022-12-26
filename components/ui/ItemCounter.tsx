import { AddCircleOutline, RemoveCircleOutline, RestaurantMenuRounded } from "@mui/icons-material"
import { Box, IconButton, Typography } from "@mui/material"
import { FC, useState } from 'react';

interface Props {
    currentValue: number;
    maxValue: number;

    //funciones
    updateQuantity: (newValue:number)=> void
}

export const ItemCounter: FC<Props> = ({ currentValue, updateQuantity, maxValue }) => {

    //funcion para incrementar o decrementar la cantidad, no usamos el useState
    //trabajamos directamente con los valores recibidos, el parametro que recibe la
    //funcion es para discriminar si el boton es de augmentar o restar
    const addOrRemove = ( value:number ) => {

        //comprobamos si el boton pulsado es el de restar
        if( value === -1) {
            if ( currentValue === 1 ) return; //no bajamos de cero

            return updateQuantity( currentValue -1 ); //retornamos para que salga del metodo y no siga el codigo de abajo de sumar
        }

        //si no es de restar es el de sumar
        if ( currentValue >= maxValue ) return; // no pasamos del maximo valor

        updateQuantity ( currentValue +1 );
    }

    return (
        <Box display='flex' alignItems='center'>
            <IconButton
                onClick={ ()=> addOrRemove(-1)}
                
            >
                <RemoveCircleOutline />
            </IconButton>

            <Typography sx={{ width: 40, textAlign: 'center' }}> { currentValue } </Typography>

            <IconButton
                onClick={ ()=> addOrRemove(+1)}
            >
                <AddCircleOutline />
            </IconButton>
        </Box>
    )
}
