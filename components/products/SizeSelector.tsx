import { Box, Button } from "@mui/material";
import { FC } from "react";
import { ISize } from '../../interfaces'

interface Props {
    selectedSize?: ISize; //importamos de interfaces/products, opcional
    sizes: ISize[]; //importamos de interfaces/products
}

export const SizeSelector: FC<Props> = ({ selectedSize, sizes }) => {
    return (
        <Box>
            {
                //mapeamos las tallas recibidas no todos los productos tienen las mismas tallas
                //para cada talla colocamos un boton para seleccionar la talla deseada
                sizes.map(size => (
                    <Button
                        key={ size }
                        size='small'
                        //si el selectedSize es igual al size le ponemos el color primary al resto info
                        color = { selectedSize === size ? 'primary' : 'info'}
                    >
                        { size}
                    </Button>
                ))
            }
        </Box>
    )
}
