import jwt from 'jsonwebtoken';

export default class Token {

    private static seed: string = 'este-es-el-seed-de-mi-app-secreto'; // semilla unica que debemos tener sin que nadie la sepa 
    private static caducidad: string = '30d'; // lo que durara el token

    constructor() { }

    static getJwtToken( payload: any ): string {
        return jwt.sign({
            usuario: payload // esto es lo unico que quiero que este dentro del token
        }, this.seed, { expiresIn: this.caducidad });

    }

    static comprobarToken( userToken: string ) {

        return new Promise( (resolve, reject ) => {

            jwt.verify( userToken, this.seed, ( err, decoded ) => {
    
                if ( err ) {
                    reject(); // si hay un error no se debe de confiar en el token
                } else {
                    resolve( decoded ); // si se resuelve, token valido
                }
    
    
            })

        });


    }


}