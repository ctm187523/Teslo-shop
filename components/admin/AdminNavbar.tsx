
import NextLink from 'next/link';
import { AppBar, Toolbar, Link, Typography, Box, Button } from '@mui/material';
import { useContext } from 'react';
import { UiContext } from '../../context/ui/UiContext';


export const AdminNavbar = () => {

  
  //usamos el Hook useContext para acceder a las variables y metodos globales del contexto UiContext 
  //ubicado en context/ui/UiContext
  const { toggleSideMenu } = useContext(UiContext);

 
  return (
    <AppBar>
      <Toolbar>
        {/* el passHref es para que le pase la referencia de la ruta */}
        <NextLink href='/' passHref>
          <Link display='flex' alignItems='center'>
            <Typography variant='h6'>Teslo |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>
        {/* El Box es como un div que nos permite tener acceso al tema principal de la aplicacion 
        con el flex =1 toma todo el espacio disponible*/}
        <Box flex={1} />
       
        {/* llamamos al metodo toggleSideMenu del contexto UiContext */}
        <Button onClick={toggleSideMenu}>
          Menu
        </Button>

      </Toolbar>
    </AppBar>
  )
}
