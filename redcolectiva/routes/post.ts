import { Router, Response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { Post } from '../models/post.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/file-system';


const postRoutes = Router();
const fileSystem = new FileSystem();


// Obtener posts Paginados
postRoutes.get('/', async (req: any, res: Response) => {
       
    let pagina = Number(req.query.pagina) || 1; // si no recibo ningun argument en la url, sera la pagina 1 por defecto
    let skip = pagina - 1; 
    skip = skip * 10;  // cero *10 = 0, esto para que no se salte ningun registro, si esta en la pagina 2, seria 2-1 = 1, *10 = 10, y se saltaria los ultimos 10 registros

    const posts = await Post.find()
    .sort({ _id: -1 }) // para que muestre primero el post mas reciente
    .skip( skip )
    .limit(10)  // para que muestre solo los primeros 10
    .populate('usuario', '-password') // rellenar la info del usuario menos la pass
    .exec();

    res.json({
      ok: true,
      pagina,
      posts
    });

});

// Crear POST
postRoutes.post('/', [ verificaToken ], (req: any, res: Response) => {

    const body = req.body;
    body.usuario = req.usuario._id;

    const imagenes = fileSystem.imagenesDeTempHaciaPost(req.usuario._id);
    body.imgs = imagenes; // las imagenes se tienen que meter en el body por que es lo qe esta mandando el objeto del post de mongo abajo

    Post.create(body).then(async postDB => {

      await postDB.populate('usuario', '-password').execPopulate(); // esta promesa ayuda para tener cargada toda la info del usuario (todos sus datos excepto la pass)

        res.json({
            ok: true,
            post: postDB
        });


    }).catch(err => {
        res.json(err)
    });


});


// Servicio para subir archivos (fotos,pdfs, etc.) en este caso solo permitiremos imagenes
postRoutes.post('/upload',  [ verificaToken ], async (req: any, res: Response) => {

    if ( !req.files ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo'
        });
    }

    const file: FileUpload = req.files.image;

    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo - image' // para que siempre incluya la propiead image
        });

    }

    
    if ( !file.mimetype.includes('image') ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Lo que subió no es una imagen'
        }); 
    }

    await fileSystem.guardarImagenTemporal( file, req.usuario._id );


    res.json({
     ok: true,
     file: file.mimetype
    });



});

postRoutes.get('/imagen/:userid/:img', (req: any, res: Response) => { // para mostrar img por url

    const userId = req.params.userid;
    const img    = req.params.img;

    const pathFoto = fileSystem.getFotoUrl( userId, img );

    res.sendFile( pathFoto ); // se manda el archivo que vendria siendo el path de la foto

});


export default postRoutes;