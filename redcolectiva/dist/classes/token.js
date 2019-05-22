"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Token {
    constructor() { }
    static getJwtToken(payload) {
        return jsonwebtoken_1.default.sign({
            usuario: payload // esto es lo unico que quiero que este dentro del token
        }, this.seed, { expiresIn: this.caducidad });
    }
    static comprobarToken(userToken) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(userToken, this.seed, (err, decoded) => {
                if (err) {
                    reject(); // si hay un error no se debe de confiar en el token
                }
                else {
                    resolve(decoded); // si se resuelve, token valido
                }
            });
        });
    }
}
Token.seed = 'este-es-el-seed-de-mi-app-secreto'; // semilla unica que debemos tener sin que nadie la sepa 
Token.caducidad = '30d'; // lo que durara el token
exports.default = Token;
