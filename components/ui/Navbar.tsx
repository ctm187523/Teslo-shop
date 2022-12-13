import NextLink from 'next/link';

import { AppBar, Toolbar, Link, Typography } from '@mui/material';


export const Navbar = () => {
  return (
    <AppBar>
        <Toolbar>
            {/* el passHref es para que le pase la referencia de la ruta al Link de abajo */}
            <NextLink href='/' passHref>
                <Link display='flex' alignItems='center'>
                   <Typography variant='h6'>Teslo |</Typography> 
                   <Typography sx={{ ml:0.5 }}>Shop</Typography> 
                </Link>
            </NextLink>
        </Toolbar>
    </AppBar>
  )
}
