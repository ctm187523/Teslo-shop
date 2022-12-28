
export interface IUser {
    _id      : string;
    name     : string;
    email    : string;
    password?: string; //password lo ponemos opcional porque no lo usamos en el frontend, lo usamos en el backend para identificar al usuario
    role     :string;

    ////Mongo crea automaticamente los timestamps(createdAt, updatedAt) en la base de datos
    //lo ponemos opcional porque no es informacion que mandemos del backen al frontend
    createdAt?: string;
    updatedAt?: string;
}