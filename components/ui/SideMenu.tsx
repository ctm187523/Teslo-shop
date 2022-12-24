
//creamos el menu lateral, MAterial se conoce como Drawer
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"
import { useContext } from "react"
import { UiContext } from '../../context/ui/UiContext';

import { useRouter } from 'next/router'



export const SideMenu = () => {

    //usamos el Hook useContext para acceder a las variables y metodos globales del contexto UiContext 
    //ubicado en context/ui/UiContext
    const { isMenuOpen, toggleSideMenu } = useContext(UiContext);

    //usamos el Hook useRouter de next para navegar
    const router = useRouter();

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
            onClose= { toggleSideMenu} //llamamos al metodo toggleSideMenu para que sea false y cierre el menu al clickar fuera del sideMenu
        >
            {/* creamos el contenido del menu lateral */}
            <Box
                sx={{ width: 250, paddingTop: 5 }}
                //onMouseLeave={toggleSideMenu} //al salir el raton del menu lateral llamamos al metodo del contexto(UiContext) para que cambie a false no lo usamos para cerrar usamos el onClose en el Drawer
            >
                <List>
                    <ListItem>
                        <Input
                            type='text'
                            placeholder="Buscar..."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                    >
                                        <SearchOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </ListItem>

                    <ListItem button>
                        <ListItemIcon>
                            <AccountCircleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Perfil'} />
                    </ListItem>

                    <ListItem button>
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


                    <ListItem button>
                        <ListItemIcon>
                            <VpnKeyOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Ingresar'} />
                    </ListItem>

                    <ListItem button>
                        <ListItemIcon>
                            <LoginOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Salir'} />
                    </ListItem>


                    {/* Admin */}
                    <Divider />
                    <ListSubheader>Admin Panel</ListSubheader>

                    <ListItem button>
                        <ListItemIcon>
                            <CategoryOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Productos'} />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <ConfirmationNumberOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Ordenes'} />
                    </ListItem>

                    <ListItem button>
                        <ListItemIcon>
                            <AdminPanelSettings />
                        </ListItemIcon>
                        <ListItemText primary={'Usuarios'} />
                    </ListItem>
                </List>
            </Box>

        </Drawer>
    )
}
