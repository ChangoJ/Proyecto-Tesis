

export class Usuario {
    constructor(
        public _id: string,
        public nombre: string,
        public username: string,
        public ci: string,
        public email: string,
        public contrasena: string,
        public rol: string,
        public phoneNumber?: string,
        public codigoVerificacion?: string,
    ){
        
    }

   
}