import { Box, Button, FormControl, Grid,  MenuItem,  TextField, Typography } from '@mui/material'
import React from 'react'
import { ShopLayout } from '../../components/layouts'
import { countries } from '../../utils';
import Cookies from 'js-cookie';

//instalamos React Hook Form con --> yarn add react-hook-form
//de la web --> https://react-hook-form.com/get-started
//de ahy copiamos y pegamos codigo del primer ejemplo
//para manejar los formularios, validaciones etc
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { CartContext } from '../../context/cart/CartContext';



type FormData = {
    firstName: string;
    lastName: string;
    address: string;
    address2: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
}

//ESTA FUNCION LA PONEMOS FUERA PARA QUE NO SE TENGA QUE REPROCESAR CADA VEZ QUE SE CARGA
//funcion que toma los valores de las Cookies para poner en el formulario los valores por defecto
//y el usaurio no tenga que volver a escribirlo, devuleve un tipo FormData
const getAddressFromCookies = (): FormData => {

    return {
        firstName: Cookies.get('firstName') || '',
        lastName: Cookies.get('lastName') || '',
        address: Cookies.get('address') || '',
        address2: Cookies.get('address2') || '',
        zip: Cookies.get('zip') || '',
        city: Cookies.get('city') || '',
        country: Cookies.get('country') || '',
        phone: Cookies.get('phone') || '',
    }
}

const AdressPage = () => {

    //importamos el router 
    const router = useRouter();

    //importamos el contexto del CartContext
    const {  updateAddress } = useContext(CartContext);

    //importamos el Hook useForm para manejar el formulario
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({

        //usamos los valores tomados de las Cookies en el metodo de arriba getAddressFromCookie para ponerlos por defecto
        //de esta manera el usuario no tiene que escribir de nuevo los valores si existen en las Cookies
        defaultValues: getAddressFromCookies() 
    });

    const onSubmitAddress = async (data: FormData) => {

        //usamos el metodo updateAddress del contexto del cartContext para actualizar la informacion de la direccion de envio
        updateAddress( data );

        //enviamos a la url checkout/summary
        router.push('/checkout/summary');
    }


    return (
        <ShopLayout title="Dirección" pageDescription="Confirmar dirección del destino">
            <Typography variant="h1" component="h1">Dirección</Typography>
            {/* usamos un form de html ver que esta en minuscula para identificar que es html
             usamos del hook de arriba useForm el handleSubmit para manejar el onSubmit al hacer click en el boton de abajo
             que es de tipo submit y para que funcione necesitamos pasarle como argumento la funcion creada arriba 
            si las validaciones pasan llamara al onLoginUser, el no Validate es para que no use las validaciones propias del navegador*/}
            <form onSubmit={handleSubmit(onSubmitAddress)} noValidate>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Nombre"
                            variant="filled"
                            fullWidth
                            //usamos el register del hook de arriba useForm para realizar la conexion entre ellos
                            //ponemos primaramente firstName para identifiarlo y seguidamente las validaciones
                            {...register('firstName', {
                                required: 'Este campo es requerido',
                            })}
                            //utilizamos error de Material Ui y entre llaves el error del Hook useForm de arriba para que muestre los errores
                            //el errors.name es un objeto pero con los dos signos de admiracion !! lo transformamos en un booleano para indicar que lo muestre si existe un error
                            //si fuera !errors.name con solo una signo de admiracion indicaria que lo muestre si no exite el error y tambien pasariamos de string a booleano
                            error={!!errors.firstName}
                            //con el helperText de Material Ui mostramos el texto del error ubicado en el required de arriba con el signo de interrogacion en name para indicar que lo muestre solo si existe el error
                            helperText={errors.firstName?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Apellidos"
                            variant="filled"
                            fullWidth
                            {...register('lastName', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Dirección"
                            variant="filled"
                            fullWidth
                            {...register('address', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.address}
                            helperText={errors.address?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Dirección 2 (opcional"
                            variant="filled"
                            fullWidth
                            {...register('address2')}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Código Postal"
                            variant="filled"
                            fullWidth
                            {...register('zip', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.zip}
                            helperText={errors.zip?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Ciudad"
                            variant="filled"
                            fullWidth
                            {...register('city', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.city}
                            helperText={errors.city?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <TextField
                                select
                                variant='filled'
                                label="País"
                                defaultValue={ Cookies.get('country') || countries[0].code}
                                {...register('country', {
                                    required: 'Este campo es requerido',
                                })}
                                error={!!errors.country}
                            //helperText={errors.firstName?.message}
                            >
                                {/* obtenemos los paises del archivo utils/countries */}
                                {
                                    countries.map((country) => (
                                        <MenuItem
                                            key={country.code}
                                            value={country.code}
                                        >
                                            { country.name}
                                        </MenuItem>
                                    ))
                                }

                            </TextField>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Teléfono"
                            variant="filled"
                            fullWidth
                            {...register('phone', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
                    <Button
                        type='submit'
                        color='secondary'
                        className="circular-btn"
                        size='large'
                    >
                        Revisar Pédido
                </Button>

                </Box>
            </form>

        </ShopLayout>
    )
}

//usamos ServerSideRendering  para trabajar del lado del servidor, cuando alguien solicite
//esta pagina va a venir precargada con la informacion del lado del servidor, 
//siempre que se ejecuta una request se ejecuta esta funcion
//usamos el getServerSideProps para que si el usuario no esta logueado o el token no es valido
//no pueda entrar en el chekout/address
//LO COMENTAMOS PORQUE USAMOS MIDDLEWARE CON EL MIDDLEWARE LO HAREMOS DE MANERA ESTATICA
//FIJARSE QUE EN LA CARPETA checkout ESTA EL _middleware IMPLEMENTADO PARA QUE SE EJECUTA ANTES DE LOS DOS ARCHIVOS QUE LE PRECEDEN
// export const getServerSideProps: GetServerSideProps = async (ctx) => {

//     //verificamos que tengamos el token en las cookies
//     const { token = ''} = ctx.req.cookies;

//     let isValidToken = false;

//     try {

//         //importamos jwt de utils/jwt y verificamos si el token es valido, esta funcion
//         //nos devuelve el id del payload del token
//         await jwt.isValidToken( token );
//         isValidToken = true; //si llegamos aqui quiere decir que el token es valido
//     } catch (error) {
//         isValidToken = false;
//     }

//     //si el token no es valido lo redirigimos al home pero con una query de la direccion donde nos encontramos
//     //para que una vez echo el login lo redirija aqui directamente desde el Home
//     if ( !isValidToken ){
//         return {
//             redirect: {
//                 destination: '/auth/login?p=/checkout/address',
//                 permanent: false,
//             }
//         }
//     }


//     return {
//         //las props son enviadas a este componente ProductPage por parametros no enviamos parametros
//         props: {

//         }
//     }
// }




export default AdressPage

