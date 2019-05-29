import Server from "./classes/server";
import moongose from 'mongoose';
import bodyParser from 'body-parser';
import userRoutes from "./routes/usuario";
import postRoutes from "./routes/post";
import fileUpload from 'express-fileupload';
import cors from 'cors';

const server = new Server ();

// Middleware se encargara de tomar toda la info de un posteo y lo prepara para manejarlo como un objeto JS.
server.app.use( bodyParser.urlencoded({ extended: true }));
server.app.use( bodyParser.json() );

// FileUpload
server.app.use( fileUpload() );

// Configurar CORS
server.app.use(cors({origin: true, credentials:true }));

// Rutas de mi app
server.app.use('/user', userRoutes );
server.app.use('/posts', postRoutes );

// Conectar la DB
moongose.connect('mongodb://localhost:27017/bdaccion',
{ useNewUrlParser: true, useCreateIndex: true}, (err) => {

    if (err) throw err;
     console.log('BD en linea');
    
} )

// Levantar Express
server.start( () =>{
    console.log(`servidor corriendo en puerto ${server.port}`);

});