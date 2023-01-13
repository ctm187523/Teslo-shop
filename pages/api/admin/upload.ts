

import type { NextApiRequest, NextApiResponse } from 'next';

//para tratar las imagenes hemos instalado --> yarn add formidable
//para usar typescript --> yarn add -D @types/formidable
import formidable from 'formidable';

//importamos de node fs no hayq ue importar nada de terceros
import fs from 'fs';

//hemos instalado cloudinary para almacenar las imagenes --> yarn add cloudinary
//pagina cloudinary --> https://cloudinary.com/
//en las variables de entorno hemos puesto el url para cloudinary VER VIDEO 382
import { v2 as cloudinary} from 'cloudinary'
//configuramos la varialble de entorno de las variables de entorno .env
cloudinary.config( process.env.CLOUDINARY_URL || ''); //si no tiene lo ponemos como un string vacio


type Data = { 
    message: string
}

//como trabajamos con imagenes no queremos serializarlas usamos la siguiente funcion:
export const config = {
    api : {
        bodyParser: false,
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return uploadFile(req, res);
    
        default:
            res.status(400).json( { message: 'Bad request'});
    }

}


//funcion para grabar en cloudinary la imagen seleccionada, devuelve una promesa de tipo String
const saveFile = async(file: formidable.File): Promise<string> => {

    //usamos fs importado de node, el cual nos da acceso al file system, al sitema de archivos creados 
    //para la aplicacion en next, COMENTAMOS EL CODDIGO DE ABAJO PORQUE USAREMOS
    //CLOUDINARY EN LUGAR DEL FILE SYSTEM(SITEMA DE ARCHIVOS DEL PROYECTO DE NEXT)
    // const data = fs.readFileSync( file.filepath ); //este seria el path temporal de la imagen
    // fs.writeFileSync(`./public/${ file.originalFilename }`, data);//hacemos la escritura y movimiento del archivo a una carpeta fisica del file system(public en este caso)de la aplicacion le damos el nombre y le pasamos la data
    // fs.unlinkSync ( file.filepath );//borramos el archivo temporal
    // return;

    console.log('entra')
    //usamos cloudinary importado arriba,ver anotaciones, y cargamos el archivo en la carpeta temporal
    //desestructuramos el secure_url de la data recibida que es la url de la imagen
    const { secure_url } = await cloudinary.uploader.upload( file.filepath);
    return secure_url;

}

//funcion para procesar la peticion, devuelve una Promesa de tipo string
const parseFiles = async(req: NextApiRequest): Promise<string> => {

    return new Promise(( resolve, reject) =>{
        
        const form = new formidable.IncomingForm(); //usamos formidable importado arriba para preparar el objeto para analizar lo que viene en la request(los archivos)
        form.parse( req, async( err, fields , files) =>{

            //console.log({err,fields, files});

            //si algo sale mal lanzamos la excepcion y no continuamos
            if ( err ){
                return reject(err);
            }

            //si todo sale bien llamamos a la funcion saveFile de arriba pasandole los archivos tipados como formidable.File
            //no es un arreglo los archivos se mandan de uno en uno
            const filePath = await saveFile( files.file as formidable.File);
            resolve(filePath); //devolvemos el url
        })
    })
}

const uploadFile = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const imageUrl = await parseFiles(req); //llamamos a la funcio de arriba para obtener el url de la imagen guardada en cloudinary

    res.status(200).json( { message: imageUrl}); //devolvemos el url que es lo que vamos a almacenar 
}