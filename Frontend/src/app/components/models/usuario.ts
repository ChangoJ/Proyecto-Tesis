import { encriptarContrasena } from '../services/utils';

export class Usuario {
    constructor(
        public _id: string,
        public nombre: string,
        public usuario: string,
        public email: string,
        public contrasena: string,
        public rol: string,
        public phoneNumber?: string,
    ){
        
    }

   
}