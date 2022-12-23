import NextLink from 'next/link';

import { AppBar, Toolbar, Link, Typography, Box, Button, IconButton } from '@mui/material';
import { SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import Badge from '@mui/material/Badge';

import { useRouter } from "next/router";


export const Navbar = () => {

  //usamos el Hook useRouter para ver que pagina esta activa, recibimos el url de la pagina que se esta mostrando
  //para poner el color de los botones hombres,mujeres y niños en un color difrente a la pagina activa
  //desestructuramos el asPath que es la informacion que queremos
  const { asPath } = useRouter();
  

  return (
    <AppBar>
      <Toolbar>
        {/* el passHref es para que le pase la referencia de la ruta */}
        <NextLink href='/' passHref style={{ textDecoration: 'none', display:'flex' ,alignItems:'center', color:'black'}}>
          <Typography variant='h6'>Teslo |</Typography>
          <Typography sx={{ ml: 0.5 }}>Shop</Typography>
        </NextLink>
        {/* El Box es como un div que nos permite tener acceso al tema principal de la aplicacion 
        con el flex =1 toma todo el espacio disponible*/}
        <Box flex={1} />
        {/* con display hacemos que si la pantalla es pequeña(xs) no se muestra lo contenido (none) y en pantallas
        mayores si se muestra en moviles por ejemplo no se veria el menu central y las opciones deben estar en el menu de la derecha
        no hace falta definir las otras medidas porque es a partir de la medida pequeña la que no se tiene que mostrar*/}
        <Box sx={{ display: {xs:'none', sm:'block'}}}>
          <NextLink href='/category/men' passHref style={{ textDecoration: 'none'}}>
            {/* cambiamos el color del boton con la condicion de que si estamos en la ruta especificada en asPath sacadad del hook de arriba useRouter 
            parea resaltar el boton en la pagina activa*/}
            <Button color={ asPath === '/category/men' ? 'primary' : 'info' }>Hombres</Button>
          </NextLink>
          <NextLink href='/category/women' passHref style={{ textDecoration: 'none'}}>
            <Button color={ asPath === '/category/women' ? 'primary' : 'info' }>Mujeres</Button>
          </NextLink>
          <NextLink href='/category/kid' passHref style={{ textDecoration: 'none'}}>
            <Button color={ asPath === '/category/kid' ? 'primary' : 'info' }>Niños</Button>
          </NextLink>
        </Box>


        <Box flex={1} />

        <IconButton>
          <SearchOutlined />
        </IconButton>
        <NextLink href='/cart' passHref style={{ textDecoration: 'none'}}>
          <IconButton>
            {/* el Badge es para colocar los numeros arriba */}
            <Badge badgeContent={2} color="secondary">
              <ShoppingCartOutlined />
            </Badge>
          </IconButton>
        </NextLink>

        <Button>
          Menu
        </Button>

      </Toolbar>
    </AppBar>
  )
}
