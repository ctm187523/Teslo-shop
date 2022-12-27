import NextLink from 'next/link';

import { AppBar, Toolbar, Link, Typography, Box, Button, IconButton, Input, InputAdornment } from '@mui/material';
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import Badge from '@mui/material/Badge';

import { useRouter } from "next/router";
import { useContext, useState } from 'react';
import { UiContext } from '../../context/ui/UiContext';


export const Navbar = () => {

  //usamos el Hook useRouter para ver que pagina esta activa, recibimos el url de la pagina que se esta mostrando
  //para poner el color de los botones hombres,mujeres y niños en un color diferente a la pagina activa
  //desestructuramos el asPath que es la informacion que queremos
  const { asPath, push } = useRouter();

  //usamos el Hook useContext para acceder a las variables y metodos globales del contexto UiContext 
  //ubicado en context/ui/UiContext
  const { toggleSideMenu } = useContext(UiContext);

  //usamos un useState para manejar la busqueda de productos
  const [searchTerm, setSearchTerm] = useState('');

  //usamos el useState para controlar de mostrar en pantallas grandes el icono del buscador
  const [isSerchVisible, setIsSerchVisible] = useState(false);


  //metodo para redirigir a la pagina que se encarga de mostrar el resultado de la busqueda de un producto
  const onSearchTerm = () => {
    //si el searchTerm del useState de arriba esta vacio salimos de la funcion, el trim() es para asegurarse que no haya espacios vacios
    if (searchTerm.trim().length === 0) return;
    push(`/search/${searchTerm}`); //abrimos la pagina con la url recibida, usamos el metodo push del hook de react useRouter importado arriba
  }


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
        {/* con display hacemos que si la pantalla es pequeña(xs) no se muestra lo contenido (none) y en pantallas
        mayores si se muestra en moviles por ejemplo no se veria el menu central y las opciones deben estar en el menu de la derecha
        no hace falta definir las otras medidas porque es a partir de la medida pequeña la que no se tiene que mostrar
        decimos que se muestre el menu de Hombre,mujeres y niños si isSerchVisible esta en false asi al aparecer el espacio para poner el texto del buscador para buscar un producto se ocultan los menus hombre,mujer niñis del Navbar*/}
        <Box sx={{ display: isSerchVisible ? 'none' : { xs: 'none', sm: 'block' } }}
          className="fadeIn">
          <NextLink href='/category/men' passHref>
            <Link>
              <Button color={asPath === '/category/men' ? 'primary' : 'info'}>Hombres</Button>
            </Link>
          </NextLink>
          <NextLink href='/category/women' passHref>
            <Link>
              <Button color={asPath === '/category/women' ? 'primary' : 'info'}>Mujeres</Button>
            </Link>
          </NextLink>
          <NextLink href='/category/kid' passHref>
            <Link>
              <Button color={asPath === '/category/kid' ? 'primary' : 'info'}>Niños</Button>
            </Link>
          </NextLink>
        </Box>


        <Box flex={1} />

        {/* Buscador Pantallas grandes al hacer click en el icono del buscador
        aparece el texto para introducir el producto a buscar */}

        {
          isSerchVisible
            ? (
              <Input
                sx={{ display: { xs: 'none', sm: 'flex' } }} //en pantallas pequeñas no lo mostramos
                className='fadeIn' //clase de los estilos globales
                autoFocus
                value={searchTerm} //usamos el useState de arriba para obtener el valor de la busqueda de productos
                onChange={(e) => setSearchTerm(e.target.value)} //usamos el useState de arriba para cambiar el valor de la busqueda de productos
                onKeyPress={(e) => e.key === 'Enter' ? onSearchTerm() : null} //si pulsamos la tecla enter llamamos a la funcion que redirige a la pagina de busqueda en caso contrario null no hacemos nada
                type='text'
                placeholder="Buscar..."
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setIsSerchVisible(false)} //si pulsamos la cruz del buscador donde poenemos el texto se oculta
                    >
                      <ClearOutlined />
                    </IconButton>
                  </InputAdornment>
                }
              />
            )
            : (
              <IconButton
                onClick={() => setIsSerchVisible(true)} //cambia la condicion del useState de arriba la propiedad isSearchVisiblevpara mostrar el texto para buscar el producto
                className="fadeIn" //clase de los estilos globales
                sx={{ display: { xs: "none", sm: 'flex' } }} //en pantallas pequeñas no lo mostramos
              >
                <SearchOutlined />
              </IconButton>
            )
        }


        {/* Buscador Pantallas pequeñas solo se muestra en pantallas pequeñas*/}
        <IconButton
          sx={{ display: { xs: "flex", sm: 'none' } }}
          onClick={toggleSideMenu} //llamamos al metodo toggleSideMenu del contexto UiContext  para que cambie a true y muestre el menu lateral para la busqueda
        >
          <SearchOutlined />
        </IconButton>

        <NextLink href="/cart" passHref>
          <Link>
            <IconButton>
              {/* el Badge es para colocar los numeros arriba */}
              <Badge badgeContent={2} color="secondary">
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        {/* llamamos al metodo toggleSideMenu del contexto UiContext */}
        <Button onClick={toggleSideMenu}>
          Menu
        </Button>

      </Toolbar>
    </AppBar>
  )
}
