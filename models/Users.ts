//para crear los modelos descargamos  --> yarn add mongoose 
import mongoose, { Schema, model, Model } from 'mongoose';
import { IUser } from '../interfaces/user';

const useSchema = new Schema({
    
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    role: { 
        type: String,
        enum: {
            values: ['admin','client','super-user','SEO'],
            message: '{VALUE} no es un role valido',
            default: 'client',
            required: true
        }
    }

}, {
    timestamps: true, //Moongose crea automaticamente los timestamps(createdAt, updatedAt)
})

//con mongoose.models.User hacemos que busque ese modelo si existe que lo use y si no 
// despues del || crea el nuevo modelo
const User:Model<IUser> = mongoose.models.User || model('User',useSchema);

export default User;
