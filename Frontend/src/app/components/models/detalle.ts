

export class Detalle {
    constructor(
        public _id: string,
        public carreras: Array<String>,
        public periodoIngles: Array<String>,
        public semestres: Array<String>,
        public ciclos:Array<String>,
        public paralelos:Array<String>,
        public horasDiurnas: Array<String>,
        public horasNocturnas: Array<String>,
        public horasAlternativaDiurnas: Array<String>,
        public horasAlternativaNocturnas: Array<String>,
    ){

    }
}

