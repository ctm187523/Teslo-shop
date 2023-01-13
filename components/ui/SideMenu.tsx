
//creamos el menu lateral, MAterial se conoce como Drawer
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined, DashboardOutlined } from '@mui/icons-material';
import { useContext, useState } from 'react';
import { UiContext } from '../../context/ui/UiContext';

import { useRouter } from 'next/router'
import { AuthContext } from '../../context/auth/AuthContext';


export const SideMenu = () => {

    //usamos el Hook useRouter de next para navegar
    const router = useRouter();

    //usamos el Hool useContext para recibir el contexto de AuthContext para recibir datos de la autenticacion del usuario
    const { isLooggedIn, user, logout } = useContext(AuthContext);


    //usamos el Hook useContext para acceder a las variables y metodos globales del contexto UiContext 
    //ubicado en context/ui/UiContext
    const { isMenuOpen, toggleSideMenu } = useContext(UiContext);

    //usamos un useState para manejar la busqueda de productos
    const [searchTerm, setSearchTerm] = useState('');


    //metodo para redirigir a la pagina que se encarga de mostrar el resultado de la busqueda de un producto
    const onSearchTerm = () => {
        //si el searchTerm del useState de arriba esta vacio salimos de la funcion, el trim() es para asegurarse que no haya espacios vacios
        if (searchTerm.trim().length === 0) return;

        navigateTo(`/search/${searchTerm}`); //llamamos a la funcion de abajo para navegar a la pagina que muestra el resultado de la busqueda de un producto
    }

    //metodo que recibe la url para navegar a la pagina seleccionada 
    const navigateTo = (url: string) => {

        toggleSideMenu(); //cerramos el menu usando el metodo del contexto UiContext
        router.push(url); //abrimos la pagina con la url recibida
    }



    return (
        <Drawer
            open={isMenuOpen}
            anchor='right' //posicion que ocupara el SideMenu(menu lateral, Drawer)
            //ponemos un blur(una opacidad, como borroso) en el fondo al abir el menu lateral y
            //una transicion para este efecto de blur
            sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
            onClose={toggleSideMenu} //llamamos al metodo toggleSideMenu para que sea false y cierre el menu al clickar fuera del sideMenu
        >
            {/* creamos el contenido del menu lateral */}
            <Box
                sx={{ width: 250, paddingTop: 5 }}
            //onMouseLeave={toggleSideMenu} //al salir el raton del menu lateral llamamos al metodo del contexto(UiContext) para que cambie a false no lo usamos para cerrar usamos el onClose en el Drawer
            >
                <List>
                    {/* Buscador de productos */}
                    <ListItem>
                        <Input
                            autoFocus
                            value={searchTerm} //usamos el useState de arriba para obtener el valor de la busqueda de productos
                            onChange={(e) => setSearchTerm(e.target.value)} //usamos el useState de arriba para cambiar el valor de la busqueda de productos
                            onKeyPress={(e) => e.key === 'Enter' ? onSearchTerm() : null} //si pulsamos la tecla enter llamamos a la funcion que redirige a la pagina de busqueda en caso contrario null no hacemos nada
                            type='text'
                            placeholder="Buscar..."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={onSearchTerm} //si pulsamos la lupa llamamos a la funcion onSearchTerm se puede hacer o pulsando enter como hemos echo arriba o pulsando el boton de la lupa
                                    >
                                        <SearchOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </ListItem>

                    <ListItem
                        // mostramos solo si el usuario esta logeado
                        sx={{ display: isLooggedIn ? 'flex' : 'none' }}
                        button
                    >
                        <ListItemIcon>
                            <AccountCircleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Perfil'} />
                    </ListItem>

                    <ListItem
                        // mostramos solo si el usuario esta logeado
                        sx={{ display: isLooggedIn ? 'flex' : 'none' }}
                        button
                        //boton que redirige a nuestro historial de ordenes(faacturas anteriores)
                        onClick={() => navigateTo('/orders/history')}
                    >
                        <ListItemIcon>
                            <ConfirmationNumberOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Mis Ordenes'} />
                    </ListItem>

                    {/* con display: { xs: '', sm: 'none' } mostramos solo la opcion en el menu para dispositivos pequeños */}
                    <ListItem
                        button
                        sx={{ display: { xs: '', sm: 'none' } }}
                        onClick={() => navigateTo('/category/men')}
                    >
                        <ListItemIcon>
                            <MaleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Hombres'} />
                    </ListItem>

                    {/* con display: { xs: '', sm: 'none' } mostramos solo la opcion en el menu para dispositivos pequeños */}
                    <ListItem
                        button
                        sx={{ display: { xs: '', sm: 'none' } }}
                        onClick={() => navigateTo('/category/women')}
                    >
                        <ListItemIcon>
                            <FemaleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Mujeres'} />
                    </ListItem>

                    {/* con display: { xs: '', sm: 'none' } mostramos solo la opcion en el menu para dispositivos pequeños */}
                    <ListItem
                        button
                        sx={{ display: { xs: '', sm: 'none' } }}
                        onClick={() => navigateTo('/category/kid')}
                    >
                        <ListItemIcon>
                            <EscalatorWarningOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Niños'} />
                    </ListItem>

                    {/* si esta logueado mostramos el boton de salir si no lo esta el boton de ingresar */}
                    {
                        isLooggedIn
                            ? (
                                <ListItem
                                    onClick={logout} //funcion del contexto de AuthContext
                                    button
                                >
                                    <ListItemIcon>
                                        <LoginOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Salir'} />
                                </ListItem>

                            ) :
                            (
                                <ListItem
                                    button
                                    // el boton de registrar nos manda al login usando la funcion creada arriba navigateTo
                                    //pasamos como query con el signo ? usando el router importado arriba la url donde se encontraba
                                    //en el momento de hacer el login en un argumento llamado p
                                    onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}
                                >
                                    <ListItemIcon>
                                        <VpnKeyOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Ingresar'} />
                                </ListItem>

                            )
                    }

                    {/* Admin , opciones de administrador solo se muestra si usando
                    del contexto del AuthContext isLooggedIn en true diciendo que el
                    usuario esta logeado y del contexto tambien tomamos el user y vemos
                    si el role es de administrador*/}

                    {
                        isLooggedIn && user?.role === 'admin' && (
                            <>
                                <Divider />
                                <ListSubheader >Admin Panel </ListSubheader>

                                <ListItem
                                    button
                                    onClick={() => navigateTo('/admin')}
                                >
                                    <ListItemIcon>
                                        <DashboardOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Dashboard'} />
                                </ListItem>
                                <ListItem
                                    button
                                    onClick={() => navigateTo('/admin/products')}
                                >
                                    <ListItemIcon>
                                        <CategoryOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Productos'} />
                                </ListItem>
                                <ListItem
                                    button
                                    onClick={() => navigateTo('/admin/orders')}
                                >
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Ordenes'} />
                                </ListItem>

                                <ListItem
                                    button
                                    onClick={() => navigateTo('/admin/users')}
                                >
                                    <ListItemIcon>
                                        <AdminPanelSettings />
                                    </ListItemIcon>
                                    <ListItemText primary={'Usuarios'} />
                                </ListItem>
                            </>
                        )
                    }

                </List>
            </Box>

        </Drawer>
    )
}
