import { Profesor } from "./profesor";

export class Asignatura {
    constructor(
        public _id: string,
        public nombre: string,
        public carrera: Array<String>,
        public semestre: Array<String>,
        public profesor: Profesor[],
        public abreviatura: string,
        public color: string
    ){

    }
}