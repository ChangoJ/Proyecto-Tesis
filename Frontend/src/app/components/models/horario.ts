import { Asignatura } from './asignatura';
import { Aula } from './aula';

export class Horario {
    constructor(
        public _id: string,
        public tipoHorario: string,
        public carrera: string,
        public semestre: string,
        public dia: Array<String>,
        public idTabla: { idAsignatura: String, idAula: String }[],
        public horas: { horaInicio: string, horaFin: string }[],
        public item: { asignatura: Asignatura, aula: Aula }[]
    ){

    }
}