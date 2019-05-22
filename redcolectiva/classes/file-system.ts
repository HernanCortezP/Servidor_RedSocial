import { FileUpload } from '../interfaces/file-upload';

import path from 'path';
import fs from 'fs';
 import uniqid from 'uniqid';

export default class FileSystem {

    constructor() { };

    guardarImagenTemporal( file: FileUpload, userId: string ) {

        return new Promise(  (resolve, reject) => {


            // crear carpetas
            const path = this.crearCarpetaUsuario(userId);
    
            // Nombre Archivo
             const nombreArchivo = this.generarNombreUnico(file.name);
             console.log(file.name);
             console.log(nombreArchivo);
    
            // Mover el archivo del Temp a la carpeta uploads
            file.mv( `${ path }/${ nombreArchivo }`, ( err: any) => {
        
                if ( err ) {
                    reject(err);
                } else {
                    resolve();
                }
    
            });
        });
}

    private generarNombreUnico(nombreOriginal: string) { // primero se extrae la extension del archivo
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[ nombreArr.length - 1 ];

        const idUnico = uniqid(); // este es el id unico, se genera con la libreria de node llamada uniqid


        return `${ idUnico }.${ extension }`;

    }

    private crearCarpetaUsuario( userId: string ) {

        const pathUser = path.resolve(  __dirname, '../uploads/', userId );
        const pathUserTemp = pathUser + '/temp';
        // console.log(pathUser);

        const existe = fs.existsSync( pathUser );

        if ( !existe ) {
            fs.mkdirSync( pathUser );
            fs.mkdirSync( pathUserTemp );
        }

        return pathUserTemp;

    }

    imagenesDeTempHaciaPost( userId: string ) {

        const pathTemp = path.resolve(  __dirname, '../uploads/', userId, 'temp' ); // path de la carpeta temp
        const pathPost = path.resolve(  __dirname, '../uploads/', userId, 'posts' ); // path de la carpeta posts

        if ( !fs.existsSync( pathTemp ) ) { // si no existe la carpeta temp que retorne un arreglo vacio, pq no hay ninguna imagen
            return [];
        }

        if ( !fs.existsSync( pathPost ) ) { // si no existe la carpeta pathPost se creará
            fs.mkdirSync( pathPost );
        }

        const imagenesTemp = this.obtenerImagenesEnTemp( userId );

    imagenesTemp.forEach( imagen => { // para mover las imagenes del temp al posts, al renombrarlas se hace el cambio de directorio
    fs.renameSync( `${ pathTemp }/${ imagen }`, `${ pathPost }/${ imagen }` )
        });

        return imagenesTemp; // aqui esta toda la coleccion de imagenes

    }

    private obtenerImagenesEnTemp( userId: string ) {

        const pathTemp = path.resolve(  __dirname, '../uploads/', userId, 'temp' ); // aqui es donde esta la carpeta de las imagenes a revisar, lo siguiente es leer este directorio

        return fs.readdirSync( pathTemp ) || []; // aqui se esta leyeno el directorio y todas las imagenes que hay, si no hay nda qe mande un arreglo vacio

    }

    getFotoUrl( userId: string, img: string ) {

        // Path POSTs
        const pathFoto = path.resolve( __dirname, '../uploads', userId, 'posts', img );


        // Si la imagen existe
        const existe = fs.existsSync( pathFoto );
        if ( !existe ) { // si no existe el path mostrar esta por defecto
            return path.resolve( __dirname, '../assets/400x250.jpg' );
        }


        return pathFoto;

    }
}