"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const post_1 = __importDefault(require("./routes/post"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const server = new server_1.default();
// Middleware se encargara de tomar toda la info de un posteo y lo prepara para manejarlo como un objeto JS.
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// FileUpload
server.app.use(express_fileupload_1.default());
// Rutas de mi app
server.app.use('/user', usuario_1.default);
server.app.use('/posts', post_1.default);
// Conectar la DB
mongoose_1.default.connect('mongodb://localhost:27017/bdaccion', { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err)
        throw err;
    console.log('BD en linea');
});
// Levantar Express
server.start(() => {
    console.log(`servidor corriendo en puerto ${server.port}`);
});