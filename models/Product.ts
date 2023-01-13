//para crear los modelos descargamos  --> yarn add mongoose 
import mongoose, { Schema, model, Model } from 'mongoose';
import { IProduct } from '../interfaces';

//creamos el Schema
const productSchema = new Schema({
    description: { type: String, required: true, default: ''},
    images: [{ type: String }],
    inStock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    sizes: [{
        type: String,
        enum: {
            values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            message: '{VALUE} no es un tamaño válido'
        }
    }],
    slug: { type: String, required: true, unique: true},
    tags: [{ type: String }],
    title: { type: String, required: true, default: ''},
    type: {
        type: String,
        enum: {
            values: ['shirts', 'pants', 'hoodies', 'hats'],
            message: '{VALUE} no es un tipo válido'
        },
        default: 'shirts'
    },
    gender: {
        type: String,
        enum: {
            values: ['men','women','kid','unisex'],
            message: '{VALUE} no es un genero válido'
        },
        default: 'women'
    }
},{
    timestamps: true //Moongose crea automaticamente los timestamps(createdAt, updatedAt)
});


//Creamos un indice de Mongo para realizar busquedas, usamos title y tags como campos de busqueda
productSchema.index({ title: 'text', tags: 'text'});


//con mongoose.models.Product hacemos que busque ese producto si existe que lo use y si no 
// despues del || crea el nuevo modelo
const Product: Model<IProduct> = mongoose.models.Product || model('Product', productSchema);

export default Product;