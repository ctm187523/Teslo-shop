
import { db } from "."
import { IProduct } from "../interfaces";
import Product from '../models/Product';



//funcion para recibir de la base de datos el producto mediante su slug
//retorna una promesa de tipo UProduct o null
export const getProductBySlug = async( slug:string): Promise<IProduct | null> => {

    await db.connect();
    //el lean() quita informacion quita todos los metodos que pudieramos utilizar posteriormente
    const product = await Product.findOne({ slug }).lean();
    await db.disconnect();

    if ( !Product ) {
        return null;
    }

    //usamos la siguiente instruccion para forzar al objeto product que sea serializado como un string
    return JSON.parse( JSON.stringify( product));

} 

interface ProductSlug {
    slug: string;
}
//funcion que devuelve el slug de todos los productos, devuelve una promesa 
//de tipo de la interfaz creada arriba ProductSlug
export const getAllProductSlugs = async(): Promise<ProductSlug[]> => {

    await db.connect();

    const slugs = await Product.find().select('slug -_id').lean();

    await db.disconnect();

    return slugs; //devuleve un arreglo de objetos que solo contienen la informacion del slug
}

//funcion para buscar un producto dependiendo del termino de busqueda, devuelve una Promesa de tipo arreglo de IProduct
export const getProductsByTerm = async ( term:string): Promise<IProduct[]> => {

     //pasamos la query q todo a minusculas
     term = term.toString().toLowerCase();
    
     await db.connect();
 
     //para realizar la busqueda usamos el indice creado en models/Product linea 40
     //en el indice creado buscamos en el title y en los tags, puede devolver mas de un prducto que cumpla la condicion
     const products = await Product.find({
         //usamos el indice creado en models/Product linea 40
         $text: { $search: term }
     })
     .select('title images price inStock slug -_id') //seleccionamos los campos title images price inStock y ponemos -_id para que el id no aparezca en el resultado de la consulta
     .lean();
 
     await db.disconnect();

     return products; //aqui no hacemos el parseo con return JSON.parse( JSON.stringify( product)); porque no ocupamos el id, ni fechas ni ninguna funcion que venga de la base de datos 
}

//funcion para obtener todos los productos devuelve una promesa de tipo array IProduct
export const getAllProducts = async(): Promise<IProduct[]> => {

     //conectamos a la base de datos
     await db.connect();

     //Hacemos la peticion a la base de datos con find usando el modelo Product de models/Product
     //el lean trae menos informacion si dejamos el find solo lo trae todo con sus metodos etc
     //con select seleccionamos los campos que queremos consultar, al final de la consulta
     //ponemos -_id para que el id no aparezca en la consulta si no lo ponemos asi sale el id
     const products = await Product.find() .lean(); 
 
     //desconectamos de la base de datos
     await db.disconnect();


    //usamos la siguiente instruccion para forzar al objeto product que sea serializado como un string
     return JSON.parse( JSON.stringify ( products ));
}

