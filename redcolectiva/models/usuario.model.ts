import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [ true, 'El nombre es necesario' ]
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true, // para no tener duplicados
        required: [ true, 'El correo es necesario' ]
    },
    password: {
        type: String,
        required: [ true, 'La contraseña es necesaria']
    }

});

usuarioSchema.method('compararPassword', function (password: string = ''): boolean {

    if (  bcrypt.compareSync( password, this.password ) ) {
        return true;
    } else {
        return false;
    }


});

interface IUsuario extends Document { // para que cuando exporte lo de abajo, tener las propiedades o el tipado del usuario
    nombre: string;
    email: string;
    password: string;
    avatar: string;
    compararPassword(password: string): boolean;
}

export const Usuario = model<IUsuario>('Usuario', usuarioSchema); // se tiene que especificar el nombre que tendra la conexion y el objeto