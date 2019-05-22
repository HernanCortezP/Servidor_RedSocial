"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    ;
    guardarImagenTemporal(file, userId) {
        return new Promise((resolve, reject) => {
            // crear carpetas
            const path = this.crearCarpetaUsuario(userId);
            // Nombre Archivo
            const nombreArchivo = this.generarNombreUnico(file.name);
            console.log(file.name);
            console.log(nombreArchivo);
            // Mover el archivo del Temp a la carpeta uploads
            file.mv(`${path}/${nombreArchivo}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    generarNombreUnico(nombreOriginal) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const idUnico = uniqid_1.default(); // este es el id unico, se genera con la libreria de node llamada uniqid
        return `${idUnico}.${extension}`;
    }
    crearCarpetaUsuario(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';
        // console.log(pathUser);
        const existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    imagenesDeTempHaciaPost(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp'); // path de la carpeta temp
        const pathPost = path_1.default.resolve(__dirname, '../uploads/', userId, 'posts'); // path de la carpeta posts
        if (!fs_1.default.existsSync(pathTemp)) { // si no existe la carpeta temp que retorne un arreglo vacio, pq no hay ninguna imagen
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) { // si no existe la carpeta pathPost se creará
            fs_1.default.mkdirSync(pathPost);
        }
        const imagenesTemp = this.obtenerImagenesEnTemp(userId);
        imagenesTemp.forEach(imagen => {
            fs_1.default.renameSync(`${pathTemp}/${imagen}`, `${pathPost}/${imagen}`);
        });
        return imagenesTemp; // aqui esta toda la coleccion de imagenes
    }
    obtenerImagenesEnTemp(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp'); // aqui es donde esta la carpeta de las imagenes a revisar, lo siguiente es leer este directorio
        return fs_1.default.readdirSync(pathTemp) || []; // aqui se esta leyeno el directorio y todas las imagenes que hay, si no hay nda qe mande un arreglo vacio
    }
    getFotoUrl(userId, img) {
        // Path POSTs
        const pathFoto = path_1.default.resolve(__dirname, '../uploads', userId, 'posts', img);
        // Si la imagen existe
        const existe = fs_1.default.existsSync(pathFoto);
        if (!existe) { // si no existe el path mostrar esta por defecto
            return path_1.default.resolve(__dirname, '../assets/400x250.jpg');
        }
        return pathFoto;
    }
}
exports.default = FileSystem;
