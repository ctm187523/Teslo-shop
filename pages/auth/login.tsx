//instalamos React Hook Form con --> yarn add react-hook-form
//de la web --> https://react-hook-form.com/get-started
//de ahy copiamos y pegamos codigo del primer ejemplo
//para manejar los formularios, validaciones etc
import { useForm } from 'react-hook-form';

import NextLink from 'next/link';

import { Box, Button, Grid, TextField, Typography, Link, Chip, Divider } from '@mui/material';
import React from 'react';
import { AuthLayout } from '../../components/layouts';
import { validations } from '../../utils';
import { ErrorOutline } from '@mui/icons-material';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/auth/AuthContext';
import { useRouter } from 'next/router';

//usamos next auth
import { getSession, signIn , getProviders} from 'next-auth/react'
import { GetServerSideProps } from 'next';



//type que usamos para el useForm importado arriba para manejar el formulario
type FormData = {
   email: string,
   password: string,
};


const LoginPage = () => {


   //importamos useRouter para navegar entre paginas
   const router = useRouter()

   //usamos el Hook importado arriba useForm
   const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

   //usamos el useState para controlar cuaando mostrar los errores de validacion del usuario
   const [showEror, setShowEror] = useState(false);

   //usamos un useState para poder manejar los provides del next auth
   const [providers, setProviders] = useState<any>({})

   //usamos un useEffect para usar el metodo getProvides importado arriba de next auth
   //este metodo devuelve una promesa
   useEffect(() => {
        
      getProviders().then( prov => {
         setProviders(prov); //usamos el setProviders del useState de arriba para mandar los providers, el credentials lo ignoramos porque es el que usamos para loguearse sin usar ningun provider
      })
           
   }, [])

   //usamos el contexto de AuthContext para recibir el estado y metodos de la autenticacion
   //LO COMENTAMOS PORQUE USAMOS NEXT AUTH
   //const { loginUser } = useContext(AuthContext);

   //funcion para hacer peticones http, usamos axios creado en api/tesloApi
   const onLoginUser = async ({ email, password }: FormData) => {

      setShowEror(false); //usamos el useState de arriba

      //COMENTAMOS TODO EL CODIGO DE ABAJO PORQUE LO HACEMOS AHORA CON NEXT AUTH

      //usamos la funcion loginUser del AuthContext importado arriba que devuelve true o false para saber si el login ha sido correcto
      //const isValidLogin = await loginUser(email, password);

      //si devuelve false el login ha fallado y mandamos un mensaje de error
      // if (!isValidLogin) {
      //    setShowEror(true); //usamos el useState de arriba para ponerlo en true y muestre el error en el componente Chip implementado abajo
      //    //pasados 3 segundos dejamos de mostrarlo
      //    setTimeout(() => setShowEror(false), 3000);
      //    return;
      // }

      //navegar a la pagina home o a la ultima pagina visitada, en el boton del register del components/ui/SideMenu.tsx 
      //hemos creado una query en la url donde almacena la ultima pagina visitada, si existe la tomamos y al hacer login
      //nos dirigimos a esa pagina en caso de que no venga nos dirige al home.
      // const destination = router.query.p?.toString() || '/'
      // router.replace(destination); //usamos replace en lugar de push para que el usuario no pueda volver a la pagina anterior

      //USAMOS NEXT AUTH, utilizamos el metodo signIn de next auth usamos la configuracion del archivo api/auth/[...nextauth].ts
      //tomamos el credentials que es la configuracion personalizada sin usar redes sociales y tomamos el email y el password
      await signIn('credentials',{ email, password});


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

                     <Chip
                        label="No reconocemos ese usario / contraseña"
                        color="error"
                        icon={<ErrorOutline />}
                        className="fadeIn"
                        sx={{ display: showEror ? 'flex' : 'none' }} //mostramos este componente si showError del useState de arriba esta en true
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
                     {/* utilizamos el router.query.p para obtener las querys que recibimos del boton 
                     del register del components/ui/SideMenu.tsx, lo hacemos asi para que en la pagina de register tenga
                     las query y de esta manera al registrarse regrese a la ultima pagina que estaba visitando ya qu en las querys
                     tenemos la referencia de la url ultima visitada antes de hacer el registro 
                     usamos un ternario para que si no hay querys mande a la url /aut/register sin nungna query*/}
                     <NextLink
                        href={ router.query.p ? `/auth/register?p=${router.query.p}`: '/auth/register'}
                        passHref
                     >
                        <Link underline='always'>
                           ¿No tienes cuenta?
                        </Link>
                     </NextLink>
                  </Grid>

                  <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
                     <Divider sx={{ width: '100%', mb: 2}}/>
                     {/* usamos los providers obtenidos arriba en el useState para colocarlos en la interfaz del login 
                     para barrerlo usamos Object.values ya que para usar directamente providers.map deberia de ser un arreglo
                     y de esta manera obtenemos todos los valores de un objeto*/}
                     {
                        Object.values( providers ).map( (provider: any) => {

                           //si el provider.id es credentials retornamos un div vacio
                           if( provider.id === 'credentials') return <div key="credentials"></div>; 
                           return (
                              <Button
                                 key={ provider.id}
                                 variant='outlined'
                                 fullWidth
                                 color="primary"
                                 sx={{ mb:1}}
                                 onClick={ ()=> signIn( provider.id)} //para el onclik usamos el signIn de next auth
                              >
                                 { provider.name}
                              </Button>
                           )
                        })
                     }
                  </Grid>
               </Grid>
            </Box>
         </form>

      </AuthLayout>
   )
}


//usamos ServerSideRendering  para trabajar del lado del servidor, cuando alguien solicite
//esta pagina va a venir precargada con la informacion del lado del servidor, 
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

   //usamos el metodo getSession  de la importacion de arriba de next auth
   //como parametro hemos desestructurado el contexto (ctx) para obtener el request(req)
   const session = await getSession( { req });

   //del contexot(ctx) hemos desestructurado tambien le query que lo usaremos para ver la query
   //que nos informa en que pagina ultima estaba el usuario antes de salir a loguearse, si
   //no viene la query redirigimos al home
   const { p='/'} = query;

   //si ya tenemos una session abierta no pasamos por el login y lo dirigimos directamente a la ultima
   //pantalla visitada usando la query(q) como string
   if( session ){
      return{
         redirect: {
            destination: p.toString(),
            permanent: false
         }
         
      }
   }
   
   //si no tenemos usa session abierta devolvemos la props en este caso vacias
   return {
       //las props son enviadas a este componente ProductPage por parametros
       props: {
           
       }
   }
}

export default LoginPage
