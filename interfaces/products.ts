export interface IProduct {
    _id: string; //lo crea Mongo
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: ISize[];
    slug: string;
    tags: string[];
    title: string;
    type: IType;
    gender: 'men'|'women'|'kid'|'unisex'

    ////Mongo crea automaticamente los timestamps(createdAt, updatedAt) en la base de datos
    createdAt: string;
    updatedAt: string;
}

export type ISize = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type IType = 'shirts'|'pants'|'hoodies'|'hats';