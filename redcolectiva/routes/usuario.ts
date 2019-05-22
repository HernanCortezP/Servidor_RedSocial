import { Router, Request, Response } from 'express';
import { Usuario } from '../models/usuario.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { verificaToken } from '../middlewares/autenticacion';

const userRoutes = Router();

// Login
userRoutes.post('/login', (req: Request, res: Response) => {

    const body = req.body; // el body contiene todo el cuerpo del user o es igual al modelo de abajo
    Usuario.findOne({ email: body.email }, (err, userDB)=> {

        if (err) throw err;

        if(!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos' // el usuario es el incorrecto
            });
        }

        if (userDB.compararPassword(body.password)) {

           const tokenUser = Token.getJwtToken({ // el token contendra todo esto
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
           })

            res.json({
            ok:true,
            token: tokenUser
            });
        } else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos **' // la pass es incorrecta
            });
        }

    });

});


// Crear usuario
userRoutes.post('/create', (req: Request, res: Response) => {

    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password:bcrypt.hashSync (req.body.password, 10), // encriptacion de 10 vueltas
        avatar: req.body.avatar

    };
     
    Usuario.create( user).then( userDB => { // el then es para cuando se resuelva la promesa
        
        const tokenUser = Token.getJwtToken({ // el token contendra todo esto
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
           });

            res.json({
            ok:true,
            token: tokenUser
            });


    

    }).catch (err => {
        res.json({
            ok: false,
            err
        });

    })


    

});

// Actualizar Usuario
userRoutes.post('/update', verificaToken, (req: any, res: Response) => {

    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email : req.body.email  || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    }

    Usuario.findByIdAndUpdate(req.usuario._id, user, {new: true}, (err, userDB) => {

      if (err) throw err;

      if ( !userDB ) {  // para saber si el usuario no existe por alguna razon
        return res.json({
            ok: false,
            mensaje: 'No existe un usuario con ese ID'
        });
    }

    const tokenUser = Token.getJwtToken({ // si todo salio bien, se construira un nuevo token con el user actualizado
        _id: userDB._id,
        nombre: userDB.nombre,
        email: userDB.email,
        avatar: userDB.avatar
       });

        res.json({
        ok:true,
        token: tokenUser
        });


    });
    
});

userRoutes.get('/', [ verificaToken ], ( req: any, res: Response ) => { // para retornar info del usuario mediante el Token

    const usuario = req.usuario;

    res.json({
        ok: true,
        usuario
    });

});

export default userRoutes;