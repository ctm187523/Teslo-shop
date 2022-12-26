import { Box, Button } from "@mui/material";
import { FC } from "react";
import { ISize } from '../../interfaces'

interface Props {
    selectedSize?: ISize; //importamos de interfaces/products, opcional, el la talla seleccionada
    sizes: ISize[]; //importamos de interfaces/products , son todas las tallas que tiene un producto

    //metodos
    onSelectedSize: (size: ISize ) => void; //metodo definido pero desarrollado en pages/product/[slug].tsx, para seleccionar la talla que el usuario escoje
}

export const SizeSelector: FC<Props> = ({ selectedSize, sizes, onSelectedSize }) => {


    return (
        <Box>
            {
                //mapeamos las tallas recibidas no todos los productos tienen las mismas tallas
                //para cada talla colocamos un boton para seleccionar la talla deseada
                sizes.map(size => (
                    <Button
                        key={ size }
                        //size='small'
                        onClick={ () => onSelectedSize( size ) } //al pulsar el boton le pasemos el size, la medida que tiene implicita el boton pulsado
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
