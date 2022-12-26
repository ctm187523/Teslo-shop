import { ISize } from "./";

//interfaz para tipar el producto que esta en el carrito
export interface ICartProduct {
    _id: string; //lo crea Mongo
    image: string;
    price: number;
    size?: ISize;
    slug: string;
    title: string;
    gender: 'men'|'women'|'kid'|'unisex';
    quantity: number;
}

