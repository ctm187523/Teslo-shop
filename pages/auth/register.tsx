//instalamos React Hook Form con --> yarn add react-hook-form
//de la web --> https://react-hook-form.com/get-started
//de ahy copiamos y pegamos codigo del primer ejemplo
//para manejar los formularios, validaciones etc
import { useForm } from 'react-hook-form';

import NextLink from 'next/link';

import { Box, Button, Grid, TextField, Typography, Link, Chip } from '@mui/material'
import React from 'react'
import { AuthLayout } from '../../components/layouts';
import { validations } from '../../utils';
import tesloApi from '../../api/tesloApi';
import { useState, useContext } from 'react';
import { ErrorOutline } from '@mui/icons-material';
import { AuthContext } from '../../context/auth/AuthContext';
import { useRouter } from 'next/router';

type FormData = {
    name: string;
    email: string,
    password: string,
}

const RegisterPage = () => {

    const router = useRouter();

    //usamos el contexto de AuthContext para recibir la funcion registerUser para hacer un registro de un usuario
    const { registerUser } = useContext(AuthContext);

    //usamos el Hook importado arriba useForm
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    //usamos el useState para controlar cuaando mostrar los errores de validacion del usuario
    const [showEror, setShowEror] = useState(false);

    //usamos un useState para controlar el error que puede venir al hacer la peticion para el registro y lo podamos mostrar si esta en true
    const [errorMessage, setErrorMessage] = useState('');

    //funcion para hacer peticones http, usamos axios creado en api/tesloApi
    const onRegisterForm = async ({ name, email, password }: FormData) => {

        setShowEror(false);

        //usamos la funcion registerUser del contexto importado arriba del AuthContext
        //nos devuelve un objeto que contiene un campo llamado hashError:boolean y otro message?:string opcional
        const { hashError, message } = await registerUser(name, email, password);

        //si devuelve true o sea que no se ha echo el registro
        if (hashError) {
            setErrorMessage( message!), //le mandamos el message al useState de arriba y ponemos el signo de admiracion porque como puede venir nulo le indicamos que si vendra ya que cuando hay un error si manda el message
            setShowEror(true); //usamos el useState de arriba para ponerlo en true y muestre el error en el componente Chip implementado abajo
            //pasados 3 segundos dejamos de mostrarlo
            setTimeout(() => setShowEror(false), 3000);
            return;
        }

        //en caso contrario si todo sale bien redirigimos al home usando el hook useRouter importado arriba
        router.replace('/'); //usamos replace en lugar de push para que el usuario no pueda volver a la pagina anterior

    }

    return (
        // importamos AuthLayout de /components/layouts
        <AuthLayout title={'Ingresar'}>
            {/* usamos un form de html ver que esta en minuscula para identificar que es html
             usamos del hook de arriba el handleSubmit para manejar el onSubmit al hacer click en el boton de abajo
             que es de tipo submit y para que funcione necesitamos pasarle como argumento la funcion creada arriba 
            si las validaciones pasan llamara al onLoginUser, el no Validate es para que no use las validaciones propias del navegador*/}
            <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }} >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>Crear cuenta</Typography>
                            <Chip
                                label={ errorMessage }
                                color="error"
                                icon={<ErrorOutline />}
                                className="fadeIn"
                                sx={{ display: showEror ? 'flex' : 'none' }} //mostramos este componente si showError del useState de arriba esta en true
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Nombre completo"
                                variant="filled"
                                fullWidth
                                //usamos el register del hook de arriba useForm para realizar la conexion entre ellos
                                //ponemos primaramente name para identifiarlo y seguidamente las validaciones
                                {...register('name', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                })}
                                //utilizamos error de Material Ui y entre llaves el error del Hook useForm de arriba para que muestre los errores
                                //el errors.name es un objeto pero con los dos signos de admiracion !! lo transformamos en un booleano para indicar que lo muestre si existe un error
                                //si fuera !errors.name con solo una signo de admiracion indicaria que lo muestre si no exite el error y tambien pasariamos de string a booleano
                                error={!!errors.name}
                                //con el helperText de Material Ui mostramos el texto del error ubicado en el required de arriba con el signo de interrogacion en name para indicar que lo muestre solo si existe el error
                                helperText={errors.name?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                type="email" //al poner el type email en tablets o moviles en el teclado aparece la arroba @
                                label="Correo"
                                variant="filled"
                                fullWidth
                                //usamos el register del hook de arriba useForm para realizar la conexion entre ellos
                                //ponemos primaremte email para identifiarlo y seguidamente las validaciones
                                {...register('email', {
                                    required: 'Este campo es requerido',
                                    //podriamos quitar el argumento y que quedara validations.isEmail simplemente, ya que si el primer argumento de la funcion es el primer argumento
                                    //de la funcion ha que va a llamar no es necesario ponerlo
                                    //llamamos a la funcion isEmail de utils/validations para que valide el email de la misma forma que hizimos en el backend
                                    validate: (val) => validations.isEmail(val)
                                })}
                                //utilizamos error de Material Ui y entre llaves el error del Hook useForm de arriba para que muestre los errores
                                //el errors.email es un objeto pero con los dos signos de admiracion !! lo transformamos en un booleano para indicar que lo muestre si existe un error
                                //si fuera !errors.email con solo una signo de admiracion indicaria que lo muestre si no exite el error y tambien pasariamos de string a booleano
                                error={!!errors.email}
                                //con el helperText de Material Ui mostramos el texto del error ubicado en el required de arriba con el signo de interrogacion en email para indicar que lo muestre solo si existe el error
                                helperText={errors.email?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Contraseña"
                                type="password"
                                fullWidth
                                //usamos el register del hook de arriba useForm para realizar la conexion entre ellos
                                //ponemos primaremte password para identifiarlo y seguidamente las validaciones
                                {...register('password', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                                })}
                                //utilizamos error de Material Ui y entre llaves el error del Hook useForm de arriba para que muestre los errores
                                //el errors.password es un objeto pero con los dos signos de admiracion !! lo transformamos en un booleano para indicar que lo muestre si existe un error
                                //si fuera !errors.password con solo una signo de admiracion indicaria que lo muestre si no exite el error y tambien pasariamos de string a booleano
                                error={!!errors.password}
                                //con el helperText de Material Ui mostramos el texto del error ubicado en el required de arriba con el signo de interrogacion en el password para indicar que lo muestre solo si existe el error
                                helperText={errors.password?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type='submit'
                                color="secondary"
                                className="circular-btn"
                                size="large"
                                fullWidth
                            >
                                Ingresar
                   </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink href="/auth/login" passHref>
                                <Link underline='always'>
                                    ¿Ya tienes cuenta?
                        </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>

            </form>

        </AuthLayout>
    )
}

export default RegisterPage;
