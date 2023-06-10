export class Profesor {
    constructor(
        public _id: string,
        public nombre: string,
        public contrato: string,
        public carrera: Array<String>,
        public observacion?: string,
    ){

    }
}