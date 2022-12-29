//instalamos React Hook Form con --> yarn add react-hook-form
//de la web --> https://react-hook-form.com/get-started
//de ahy copiamos y pegamos codigo del primer ejemplo
//para manejar los formularios, validaciones etc
import { useForm } from 'react-hook-form';

import NextLink from 'next/link';

import { Box, Button, Grid, TextField, Typography, Link } from '@mui/material';
import React from 'react';
import { AuthLayout } from '../../components/layouts';
import { validations } from '../../utils';
import { tesloApi } from '../../api';

//type que usamos para el useForm importado arriba para manejar el formulario
type FormData = {
   email: string,
   password: string,
};


const LoginPage = () => {

   const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

   //funcion para hacer peticones http, usamos axios creado en api/tesloApi
   const onLoginUser = async({ email, password}: FormData) => {
      
      try {
         //usando axios importado api/tesloApi hacemos un post a la ruta de pages/api/user/login
         //y mandamos los datos a postear
         const { data } = await tesloApi.post('/user/login',{ email, password});
         const { token, user } = data; //recibimos el token y el user de la data recibida
         console.log({ token, user})
      } catch (error) {
         console.log('Error en las credenciales ')
      }
   }


   return (
      // importamos AuthLayout de /components/layouts
      <AuthLayout title={'Ingresar'}>
         {/* usamos un form de html ver que esta en minuscula para identificar que es html
         usamos del hook de arriba el handleSubmit para manejar el onSubmit al hacer click en el boton de abajo
         que es de tipo submit y para que funcione necesitamos pasarle como argumento la funcion creada arriba 
         si las validaciones pasan llamara al onLoginUser, el no Validate es para que no use las validaciones propias del navegador*/}
         <form onSubmit={handleSubmit(onLoginUser)} noValidate>
            <Box sx={{ width: 350, padding: '10px 20px' }} >
               <Grid container spacing={2}>
                  {/* ponemos xs=12 para que ocupe todo el ancho del Grid al ser xs la medida mas pequeña todos los formatos seran 12 */}
                  <Grid item xs={12}>
                     <Typography variant='h1' component='h1'>Iniciar Sesión</Typography>
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
                           validate: (val)=> validations.isEmail(val) 

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
                        type="submit"
                        color="secondary"
                        className="circular-btn"
                        size="large"
                        fullWidth
                     >
                        Ingresar
                       </Button>
                  </Grid>

                  <Grid item xs={12} display='flex' justifyContent='end'>
                     <NextLink href="/auth/register" passHref>
                        <Link underline='always'>
                           ¿No tienes cuenta?
                     </Link>
                     </NextLink>
                  </Grid>
               </Grid>
            </Box>
         </form>

      </AuthLayout>
   )
}

export default LoginPage
