
//en caso de no poner ningun query en el url ->http://localhost:3000/api/search
//mostramos um mensaje de error

import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
     message: string;
    }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {


    res.status(400).json( { message: 'Debe de especificar el query de búsqueda'});


}