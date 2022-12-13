import NextLink from 'next/link';

import { AppBar, Toolbar, Link, Typography, Box, Button, IconButton } from '@mui/material';
import { SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import Badge from '@mui/material/Badge';


export const Navbar = () => {
  return (
    <AppBar>
      <Toolbar>
        {/* el passHref es para que le pase la referencia de la ruta al Link de abajo */}
        <Link href='/' display='flex' alignItems='center'>
          <Typography variant='h6'>Teslo |</Typography>
          <Typography sx={{ ml: 0.5 }}>Shop</Typography>
        </Link>
        {/* El Box es como un div que nos permite tener acceso al tema principal de la aplicacion 
        con el flex =1 toma todo el espacio disponible*/}
        <Box flex={1} />
        {/* con display hacemos que si la pantalla es pequeña(xs) no se muestra lo contenido (none) y en pantallas
        mayores si se muestra en moviles por ejemplo no se veria el menu central y las opciones deben estar en el menu de la derecha
        no hace falta definir las otras medidas porque es a partir de la medida pequeña la que no se tiene que mostrar*/}
        <Box sx={{ display: {xs:'none', sm:'block'}}}>
          <Link href='/category/men'>
            <Button>Hombres</Button>
          </Link>
          <Link href='/category/women'>
            <Button>Mujeres</Button>
          </Link>
          <Link href='/category/kid'>
            <Button>Niños</Button>
          </Link>
        </Box>


        <Box flex={1} />

        <IconButton>
          <SearchOutlined />
        </IconButton>
        <Link href='/cart'>
          <IconButton>
            {/* el Badge es para colocar los numeros arriba */}
            <Badge badgeContent={2} color="secondary">
              <ShoppingCartOutlined />
            </Badge>
          </IconButton>
        </Link>

        <Button>
          Menu
        </Button>

      </Toolbar>
    </AppBar>
  )
}
