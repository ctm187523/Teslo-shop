import React, { ChangeEvent, FC, useRef } from 'react'
import { AdminLayout } from '../../../components/layouts'
import { IProduct } from '../../../interfaces';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { dbProducts } from '../../../database';
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { tesloApi } from '../../../api';
import { GetServerSideProps } from 'next';
import { Product } from '../../../models';


const validTypes = ['shirts', 'pants', 'hoodies', 'hats']
const validGender = ['men', 'women', 'kid', 'unisex']
const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']


interface FormData {

    _id?: string;  //lo crea mongo lo ponemos opcional porque al crear unnuevo producto no lo tenemos
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: string[];
    slug: string;
    tags: string[];
    title: string;
    type: string;
    gender: string;

}

interface Props {
    product: IProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {

    const router = useRouter();

    //usamos el Hook useRef,el useRef al haber un cambio no redibuja como hace el useState
    //la usamos en el input de abajo para acceder a los archivos del ordenador
    const fileInputRef = useRef<HTMLInputElement>(null)

    //usamos el Hook useForm de ReactForm
    const { register, handleSubmit, formState: { errors }, getValues, setValue, watch } = useForm<FormData>({

        //data inicial
        defaultValues: product //como valor de defecto ponemos todo el producto que recibimos en las props
    });

    //creamos un useState para manejar la creacion de nuevas etiquetas
    const [newTagValue, setNewTagValue] = useState('');

    //creamos un useState para que si se da el boton de guardar, no podamos volver a pulsarlo
    const [isSaving, setIsSaving] = useState(false);

    // usamos un useEffect donde usamos un observador de React form ->watch
    //hacemos una subscripcion a este observado que luego limpiamos al salir de la pagina en el return del useEffect
    //como depencia tenemos el observador watch y el setValue, el codigo lo que hace es
    //que al cambiar el title el programa sugiere un slug para el url a la derecha del title
    useEffect(() => {

        const subscription = watch((value, { name, type }) => {

            if (name === 'title') {
                //creamos un nuevo slug primeramente limpiamos con trim
                const newSlug = value.title?.trim()
                    .replaceAll(' ', '_') //remplazamos los espacios vacios por guion bajo
                    .replaceAll("'", '') //remplazamos los apostrofes por string vacio
                    .toLocaleLowerCase() || '';  //lo ponemos todo en minuscula y si no viene nada un string vacio

                //establecemos el nuevo valor del slug usando el setValue de ReactForm 
                setValue('slug', newSlug);
            }
        });
        //nos quitamos de la subscripcion al salir de la pagina
        return () => subscription.unsubscribe();
    }, [watch, setValue]) //dependencias


    //funcion para crear una nueva etiqueta en el formulario
    const onNewTag = () => {

        //recibimos el valor del useState de arriba y lo almacenamos en una constante
        const newTag = newTagValue.trim().toLowerCase();

        //ponemos un string vacio el useState
        setNewTagValue('');

        const currentTags = getValues('tags'); //recibimos las tags con el getValues de ReactForm

        if (currentTags.includes(newTag)) {
            return; //si ya existe no hacemos nada
        }

        //añadimos la nueva etiqueta creada de la constante de arriba, como mantenemos la referencia y hacemos un push que muta
        //no creamos un nuevo arreglo no hace falta llamar al setValues del ReactForm
        currentTags.push(newTag);

    }

    //metodo para borrar una etiqueta
    const onDeleteTag = (tag: string) => {

        //recibimos con getValues de ReactForm las etiquetas pero aplicamos el filter para no 
        //recibir la que etiquerta que recibimos por parametro
        const updatedTags = getValues('tags').filter(t => t !== tag);
        setValue('tags', updatedTags, { shouldValidate: true }); //con setValue de ReactForm modificamos el array de las tags

    }

    //metodo para cargar las imagenes seleccionadas, recibe por parametro el event
    //que desestructuramos el target y el target obtenemos las imagenes seleccionadas
    const onFilesSelected = async ({ target }: ChangeEvent<HTMLInputElement>) => {

        //si no tenemos las imagenes o su contenido es 0 salimos del metodo
        if (!target.files || target.files.length === 0) {
            return;
        }

        //cargamos las imagenes de la manera no recomendada colocandolas en la carpeta public
        //pero LO HAREMOS DE OTRA MANERA MAS SEGURA
        try {
            //itereamos con un bucle for las imagenes, en el archivo tsconfig.json hemos agregado --> "downlevelIteration": true para que no de error
            for (const file of target.files) {
                const formData = new FormData(); //creamos un objeto FormData que viene en el navegador para mandar la data
                formData.append('file', file); //añadimos el fichero al formData y le damos el nombre de file
                //usamos axios en tesloApi de api/tesloApi y hacemos un Post de tipo message:string al endpoint api/admin/upload y mandamos el formData
                const { data } = await tesloApi.post<{ message: string }>('/admin/upload', formData);
                //usamos el setValue de ReactForm para modificar las imagenes obtenemos con el getValues la images le pasamos las nuevas imagenes y con shouldValidate: true hacemos que se renderize para ver los cambios
                setValue('images', [...getValues('images'), data.message], { shouldValidate: true })
            }

        } catch (error) {

        }

    }

    //funcion para borrar una imagen 
    const onDeleteImage = ( image:string) => {

        //usamos el setValue de ReactForm para modificar el array de imagenes, con getValues de ReactForm obtenemos las imagenes
        //y usamos el filter para que se añadan an al array todas las imagenes que sean diferenntes de la imagen pasada por parametro
        //con shouldValidate: true hacemos que se renderize para ver los cambios
        setValue('images', getValues('images').filter ( img =>img !== image), { shouldValidate: true});
    }

    //la data recibida es de tipo FormData creada en la nterfaz de arriba
    const onSubmit = async (form: FormData) => {

        if (form.images.length < 2) return alert('Minimo 2 imagenes');

        setIsSaving(true); //cambiamo el useState de arriba a true para que el boton de guardar quede desabilitado

        try {
            //usamos el metodo tesloApi de api/tesloApi para usar axios y hacer el RespFulAPi
            const { data } = await tesloApi({
                url: '/admin/products',
                method: form._id ? 'PUT' : 'POST', //si tenemos un _id es actualizar(PUT) si no crear(POST)
                data: form
            });


            //si form._id no existe quiere decir que se creo un nuevo producto
            if (!form._id) {
                //navegamos a la pantalla usando useRoute importado arriba
                router.replace(`/admin/products/${form.slug}`)
            } else {
                setIsSaving(false);
            }
        } catch (error) {
            console.log(error);
            setIsSaving(false);
        }

    }

    const onChangeSize = (size: string) => {

        //en currentSizes obtenemos todos los sizes actuales usango getValues de ReactForm
        const currentSizes = getValues('sizes');

        //si ya existe en el arreglo quiere decir que el usuario lo quiere eliminar
        if (currentSizes.includes(size)) {
            //usamos filter de javascript para decir que incluya todos menos el que coincide, con shouldValidate: true hacemos que se renderize para ver los cambios
            return setValue('sizes', currentSizes.filter(s => s !== size), { shouldValidate: true });
        }

        //si no esta en el arreglo lo arreglamos, la nueva talla estara al final del array
        //las tallas se ordenaran en el backend, con shouldValidate: true hacemos que se renderize para ver los cambios
        setValue('sizes', [...currentSizes, size], { shouldValidate: true });

    }

    return (
        <AdminLayout
            title={'Producto'}
            subTitle={`Editando: ${product.title}`}
            icon={<DriveFileRenameOutline />}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
                    <Button
                        color="secondary"
                        startIcon={<SaveOutlined />}
                        sx={{ width: '150px' }}
                        type="submit"
                        disabled={isSaving} //usamos la condicion del useState de arriba
                    >
                        Guardar
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    {/* Data */}
                    <Grid item xs={12} sm={6}>

                        <TextField
                            label="Título"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            //validamos usando reactForm
                            {...register('title', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                            })}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                        />

                        <TextField
                            label="Descripción"
                            variant="filled"
                            fullWidth
                            multiline
                            sx={{ mb: 1 }}
                            //validamos usando reactForm
                            {...register('description', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />

                        <TextField
                            label="Inventario"
                            type='number'
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            //validamos usando reactForm
                            {...register('inStock', {
                                required: 'Este campo es requerido',
                                min: { value: 0, message: 'Mínimo de valor cero' }
                            })}
                            error={!!errors.inStock}
                            helperText={errors.inStock?.message}
                        />

                        <TextField
                            label="Precio"
                            type='number'
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            //validamos usando reactForm
                            {...register('price', {
                                required: 'Este campo es requerido',
                                min: { value: 0, message: 'Mínimo de valor cero' }
                            })}
                            error={!!errors.price}
                            helperText={errors.price?.message}
                        />

                        <Divider sx={{ my: 1 }} />

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Tipo</FormLabel>
                            <RadioGroup
                                row
                                value={getValues('type')} //usamos el metodo del FormHook para obtener el valor 
                                //cambiamos el valor seleccionado usando el metodo el FommHook setValue, el shouldValidate es para que haga un preRender
                                //renderize y cambie el valor
                                onChange={({ target }) => setValue('type', target.value, { shouldValidate: true })}
                            >
                                {
                                    validTypes.map(option => (
                                        <FormControlLabel
                                            key={option}
                                            value={option}
                                            control={<Radio color='secondary' />}
                                            label={capitalize(option)}
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Género</FormLabel>
                            <RadioGroup
                                row
                                value={getValues('gender')} //usamos el metodo del FormHook para obtener el valor 
                                //cambiamos el valor seleccionado usando el metodo el FommHook setValue, el shouldValidate es para que haga un preRender
                                //renderize y cambie el valor
                                onChange={({ target }) => setValue('gender', target.value, { shouldValidate: true })}
                            >
                                {
                                    validGender.map(option => (
                                        <FormControlLabel
                                            key={option}
                                            value={option}
                                            control={<Radio color='secondary' />}
                                            label={capitalize(option)}
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormGroup>
                            <FormLabel>Tallas</FormLabel>
                            {
                                validSizes.map(size => (
                                    <FormControlLabel
                                        key={size}
                                        //le decimos que seleccione(checked) los valores incluidos en ValidSizes.map usando getValues de ReactForm
                                        control={<Checkbox checked={getValues('sizes').includes(size)} />}
                                        label={size}
                                        onChange={() => onChangeSize(size)} //llamamos a la funcion creada arriba onChangeSize pasando la size a incluir al ser seleccionada por el usuario
                                    />
                                ))
                            }
                        </FormGroup>

                    </Grid>

                    {/* Tags e imagenes */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Slug - URL"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            //validamos usando reactForm
                            {...register('slug', {
                                required: 'Este campo es requerido',
                                validate: (val) => val.trim().includes(' ') ? 'No puede tener espacios en blanco' : undefined
                            })}
                            error={!!errors.slug}
                            helperText={errors.slug?.message}
                        />

                        <TextField
                            label="Etiquetas"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            helperText="Presiona [spacebar] para agregar"
                            value={newTagValue} //usamos el useState de arriba para recibir el valor
                            //usamos el useState de arriba para cambiar el valor
                            onChange={({ target }) => setNewTagValue(target.value)}
                            //al pulsar una tecla desestructuramos code y si es igual a la barra espacioadora(Space)
                            //usamos un ternario para llamar al metodo creado arriba onNewTag si no undefined
                            onKeyUp={({ code }) => code === 'Space' ? onNewTag() : undefined}
                        />

                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            p: 0,
                            m: 0,
                        }}
                            component="ul">
                            {
                                getValues('tags').map((tag) => {

                                    return (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            onDelete={() => onDeleteTag(tag)}
                                            color="primary"
                                            size='small'
                                            sx={{ ml: 1, mt: 1 }}
                                        />
                                    );
                                })}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box display='flex' flexDirection="column">
                            <FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
                            <Button
                                color="secondary"
                                fullWidth
                                startIcon={<UploadOutlined />}
                                sx={{ mb: 3 }}
                                onClick={() => fileInputRef.current?.click()} //usamos el hook useRef creado arriba y referenciado abajo en el input para simular el click en este boton y salgan los ficheros del ordenador
                            >
                                Cargar imagen
                            </Button>

                            {/* creamos un input para cargar las imagenes desde las carpetas de nuestro ordenador*/}
                            <input
                                ref={fileInputRef} //usamos el Hook creado arriba useRef para pasarle la referencia
                                type="file"
                                multiple
                                accept='image/png, image/gif, image/jpeg'
                                style={{ display: 'none' }} //ponemos display en none para que no se vea el boton que genera input
                                onChange={onFilesSelected} //cuando el input cambie, hemos cargado imagenes al hacer clik al boton de arriba llama a la funcion
                            />

                            <Chip
                                label="Es necesario al 2 imagenes"
                                color='error'
                                variant='outlined'
                                sx={{ display: getValues('images').length <2 ? 'flex' : 'none'}}
                            />

                            <Grid container spacing={2}>
                                {
                                    // obtenemos de getValues de React Form las imagenes
                                    getValues('images').map(img => (
                                        <Grid item xs={4} sm={3} key={img}>
                                            <Card>
                                                <CardMedia
                                                    component='img'
                                                    className='fadeIn'
                                                    image={ img }
                                                    alt={img}
                                                />
                                                <CardActions>
                                                    <Button
                                                        fullWidth
                                                        color="error"
                                                        onClick={() => onDeleteImage(img)} //llamamos a la funcion de arriba para borrar la imagen
                                                        >
                                                        Borrar
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                                }
                            </Grid>

                        </Box>

                    </Grid>

                </Grid>
            </form>
        </AdminLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
//Evaluamos si vamos a obtener un producto o vamos a crear un nuevo producto
export const getServerSideProps: GetServerSideProps = async ({ query }) => {

    const { slug = '' } = query;

    let product: IProduct | null;

    // si en el url pone nuevo sugnifica que hay que crear un nuevo producto
    if (slug === 'new') {

        //creamos un nuevo objeto usando el modelo Product de MOONGOSE 
        const tempProduct = JSON.parse(JSON.stringify(new Product()));

        delete tempProduct._id; //borramos el _id del producto creado
        tempProduct.images = ['img1,jpg', 'img2.jpg'] //aunno tenemos imagenes le damos un valor temporal
        product = tempProduct;

    } else {

        //recibimos el producto por su slug
        product = await dbProducts.getProductBySlug(slug.toString());
    }



    if (!product) {
        return {
            redirect: {
                destination: '/admin/products',
                permanent: false,
            }
        }
    }


    return {
        props: {
            product
        }
    }
}


export default ProductAdminPage