
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

