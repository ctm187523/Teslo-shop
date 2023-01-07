import { useState, useEffect } from 'react';
import { PeopleOutline } from '@mui/icons-material'
import useSWR from 'swr';

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Grid, Select, MenuItem } from '@mui/material';

import { AdminLayout } from '../../components/layouts'
import { IUser } from '../../interfaces';
import { tesloApi } from '../../api';




const UsersPage = () => {

    //usamos useSWR para el endpoint
    const { data, error } = useSWR<IUser[]>('/api/admin/users');

    //usamos el useState para que al cambiar en el select la opcion creemos un cambio de 
    //estado y se renderize la pantalla, en React si no hay un cambio de estado no se
    //renderiza la pantalla
    const [ users, setUsers ] = useState<IUser[]>([]);

    //usamos el useEffect para que cada vez que cambie la data cambiamos los users del useState de arriba
    useEffect(() => {
      if (data) {
          setUsers(data);
      }
    }, [data])
    

    //si no hay data ni error quiere decir que esta caargando
    if ( !data && !error ) return (<></>);

    //funcion para hacer peticiones put al endpoint
    const onRoleUpdated = async( userId: string, newRole: string ) => {

        //creamos esta funcion por si se produce un error al hacer la peticion al endpoint
        //podamos revertir la situacion ya que abajo en updatedUsers ya cambia el estado
        const previosUsers = users.map( user => ({ ...user }));

        //mapeamos los users del state de arriba y si el userId es igual al userId
        //recibido por parametro cambiamos el role 
        const updatedUsers = users.map( user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }));

        //actualizamos del state de arriba con el setUsers usando el uodateUsers creado arriba en el metodo
        setUsers(updatedUsers);

        try {
            //hacemos la peticion al endpoint, hemos echo los cambios antes en el estado antes de hacer la peticion
            //para que todo fluya mas rapido, ya que la peticion puede tardar mas
            await tesloApi.put('/admin/users', {  userId, role: newRole });

        } catch (error) {
            setUsers( previosUsers ); //si tenemos un error mandamos el previousUsers de arriba en el metodo donde no se ha efectuado ningun cambio
            console.log(error);
            alert('No se pudo actualizar el role del usuario');
        }

    }


    //creamos las columnas dentro de la funcion porque necesitamos valores que cambian
    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 250 },
        { field: 'name', headerName: 'Nombre completo', width: 300 },
        {
            field: 'role', 
            headerName: 'Rol', 
            width: 300,
            renderCell: ({row}: GridValueGetterParams | any) => {
                return (
                    <Select
                        value={ row.role }
                        label="Rol"
                        onChange={ ({ target }) => onRoleUpdated( row.id, target.value ) }
                        sx={{ width: '300px' }}
                    >
                        <MenuItem value='admin'> Admin </MenuItem>
                        <MenuItem value='client'> Client </MenuItem>
                        <MenuItem value='super-user'> Super User </MenuItem>
                        <MenuItem value='SEO'> SEO </MenuItem>
                    </Select>
                )
            }
        },
    ];

    //creamos las filas haciendo un map de los users del useState de arriba
    const rows = users.map( user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }))


  return (
    <AdminLayout 
        title={'Usuarios'} 
        subTitle={'Mantenimiento de usuarios'}
        icon={ <PeopleOutline /> }
    >


        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height:650, width: '100%' }}>
                <DataGrid 
                    rows={ rows }
                    columns={ columns }
                    pageSize={ 10 }
                    rowsPerPageOptions={ [10] }
                />

            </Grid>
        </Grid>
    </AdminLayout>
  )
}

export default UsersPage;