
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from "rxjs";
import { Detalle } from '../models/detalle';



@Injectable()
export class DetalleService {

    public url: string
    public detalles!: any
    public semestres: any[] = []
    public horasDiurnas: any[] = []
    public horasNocturnas: any[] = []
    public horasAlternativaDiurnas: any[] = []
    public horasAlternativaNocturnas: any[] = []
    public ciclos: any[] = []
    public carreras: any[] = []
    public roles: any = []
    public rolesIndex: any[] = []
    public ciclosIndex: any[] = []
    public carrerasIndex: any[] = []
    public semestresIndex: any[] = []
    public periodoInglesIndex: any[] = []
    private rolesSubject = new BehaviorSubject<any[]>([]);
    private carrerasSubject = new BehaviorSubject<any[]>([]);
    private semestresSubject = new BehaviorSubject<any[]>([]);
    private ciclosSubject = new BehaviorSubject<any[]>([]);
    private rolesSubjectIndex = new BehaviorSubject<any[]>([]);
    private carrerasSubjectIndex = new BehaviorSubject<any[]>([]);
    private semestresSubjectIndex = new BehaviorSubject<any[]>([]);
    private ciclosSubjectIndex = new BehaviorSubject<any[]>([]);
    private periodoInglesSubjectIndex = new BehaviorSubject<any[]>([]);
    private horasDiurnasSubject = new BehaviorSubject<any[]>([]);
    private horasNocturnasSubject = new BehaviorSubject<any[]>([]);
    private horasAlternativaDiurnasSubject = new BehaviorSubject<any[]>([]);
    private horasAlternativaNocturnasSubject = new BehaviorSubject<any[]>([]);
    private paralelos: any[] = []
    private paralelosSubject: any = new BehaviorSubject<any[]>([]);
    private periodosIngles: any[] = []
    private periodosInglesSubject: any = new BehaviorSubject<any[]>([]);
    private paralelosIndex: any[] = []
    private paralelosSubjectIndex: any = new BehaviorSubject<any[]>([]);

    Global = {
        url: 'http://localhost:3900/api/',
    }


    horariosType = [
        { id: 1, textField: 'Diurno' },
        { id: 2, textField: 'Nocturno' }
    ];

    authToken = localStorage.getItem('datosUsuario');

    userData = JSON.parse(this.authToken!)

    ubicaciones = [
        { id: 1, textField: 'Campus Norte' },
        { id: 2, textField: 'Campus Colon' },
        { id: 3, textField: 'ZOOM' }
    ];

    public contratos: any[] = [
    { id: 1, textField: 'Tiempo Completo' },
    { id: 2, textField: 'Medio Tiempo' },
    { id: 3, textField: 'Tiempo Parcial' }
  ];


    constructor(
        private _http: HttpClient
    ) {
        this.url = this.Global.url;
        this.initializeData()
    }

    ngOnInit(): void {

    }

    private async initializeData() {
        try {
            let resultado = await this.getDetalles().toPromise();
            if (resultado.status === "success") {

                let carreras = []
                let semestres = []
                let ciclos = []
                let paralelos = []
                let periodosIngles = []
                this.carreras = []
                this.semestres = []
                this.ciclos = []
                this.paralelos = []
                this.periodosIngles = []
                this.carrerasIndex = []
                this.paralelosIndex = []
                let paralelosIndex = []
                let rolesCarreras = []
                let rolesCarrerasDic = []
                let rolesCarrerasDiccionario: any = []
                this.horasDiurnas = resultado.detalles[0].horasDiurnas;
                this.horasNocturnas = resultado.detalles[0].horasNocturnas
                this.horasAlternativaDiurnas = resultado.detalles[0].horasAlternativaDiurnas;
                this.horasAlternativaNocturnas = resultado.detalles[0].horasAlternativaNocturnas

                carreras = resultado.detalles[0].carreras;
                semestres = resultado.detalles[0].semestres;
                ciclos = resultado.detalles[0].ciclos;
                paralelos = resultado.detalles[0].paralelos;
                periodosIngles = resultado.detalles[0].periodoIngles;
                rolesCarreras = resultado.detalles[0].carreras;
                rolesCarrerasDic = resultado.detalles[0].carreras;
                this.setCarreras(carreras);
                this.setSemestres(semestres);
                this.setCiclos(ciclos);
                this.setParalelos(paralelos);
                this.setPeriodosIngles(periodosIngles);

                this.carrerasIndex = carreras.map((carrera: any, index: number) => {
                    return { id: index + 1, textField: carrera };
                });

                this.semestresIndex = semestres.map((semestre: any, index: number) => {
                    return { id: index + 1, textField: semestre };
                });

                this.ciclosIndex = ciclos.map((ciclo: any, index: number) => {
                    return { id: index + 1, textField: ciclo };
                });

                this.periodoInglesIndex = periodosIngles.map((periodo: any, index: number) => {
                    return { id: index + 1, textField: periodo };
                });

                this.paralelosIndex = paralelos.map((paralelo: any, index: number) => {
                    return { id: index + 1, textField: paralelo };
                });


                this.roles = [
                    { id: 1, textField: 'Superadministrador' },
                    { id: 2, textField: 'Administrador' },
                    { id: 3, textField: 'Aprobador' },
                    { id: 4, textField: 'Revisador' },
                ];

               

                rolesCarreras.forEach((nombreCarrera: any, index: any) => {
                    let nuevoRol = {
                        id: index + 1 + this.roles.length,
                        textField: nombreCarrera
                    };
                    this.roles.push(nuevoRol);
                });



                this.setRolesIndex(this.roles)

                rolesCarrerasDic.forEach((nombreCarreraRoles: any) => {
                    rolesCarrerasDiccionario[nombreCarreraRoles.toLowerCase().replace(/\s/g, "")] = nombreCarreraRoles;
                });



                this.setRolesCarrera(rolesCarrerasDiccionario)



                this.setCarrerasIndex(this.carrerasIndex);
                this.setSemestresIndex(this.semestresIndex);
                this.setCiclosIndex(this.ciclosIndex);
                this.setPeriodosInglesIndex(this.periodoInglesIndex);
                this.setParalelosIndex(this.paralelosIndex);

                this.setHorasDiurnas(this.horasDiurnas)
                this.setHorasNocturnas(this.horasNocturnas)
                this.setHorasAlternativaDiurnas(this.horasAlternativaDiurnas)
                this.setHorasAlternativaNocturnas(this.horasAlternativaNocturnas)

            }
        } catch (error) {
            console.error(error);
        }


    }

    public setRolesCarrera(roles: any[]): void {
        this.roles = roles;
        this.rolesSubject.next(this.roles);
    }

    public getRolesCarrera(): Observable<any[]> {
        return this.rolesSubject.asObservable();
    }

    public setCarreras(carreras: any[]): void {
        this.carreras = carreras;
        this.carrerasSubject.next(this.carreras);
    }

    public getCarreras(): Observable<any[]> {
        return this.carrerasSubject.asObservable();
    }

    public setSemestres(semestres: any[]): void {
        this.semestres = semestres;
        this.semestresSubject.next(this.semestres);
    }

    public getSemestres(): Observable<any[]> {
        return this.semestresSubject.asObservable();
    }

    public setCiclos(ciclos: any[]): void {
        this.ciclos = ciclos;
        this.ciclosSubject.next(this.ciclos);
    }

    public getCiclos(): Observable<any[]> {
        return this.ciclosSubject.asObservable();
    }

    public setRolesIndex(rolesIndex: any[]): void {
        this.rolesIndex = rolesIndex;
        this.rolesSubjectIndex.next(this.rolesIndex);
    }

    public getRolesIndex(): Observable<any[]> {
        return this.rolesSubjectIndex.asObservable();
    }

    public setCarrerasIndex(carrerasIndex: any[]): void {
        this.carrerasIndex = carrerasIndex;
        this.carrerasSubjectIndex.next(this.carrerasIndex);
    }

    public getCarrerasIndex(): Observable<any[]> {
        return this.carrerasSubjectIndex.asObservable();
    }

    public setSemestresIndex(semestres: any[]): void {
        this.semestresIndex = semestres;
        this.semestresSubjectIndex.next(this.semestresIndex);
    }

    public getSemestresIndex(): Observable<any[]> {
        return this.semestresSubjectIndex.asObservable();
    }

    public setCiclosIndex(ciclos: any[]): void {
        this.ciclosIndex = ciclos;
        this.ciclosSubjectIndex.next(this.ciclosIndex);
    }

    public getCiclosIndex(): Observable<any[]> {
        return this.ciclosSubjectIndex.asObservable();
    }

    public setPeriodosInglesIndex(periodosIndex: any[]): void {
        this.periodoInglesIndex = periodosIndex;
        this.periodoInglesSubjectIndex.next(this.periodoInglesIndex);
    }

    public getPeriodosInglesIndex(): Observable<any[]> {
        return this.periodoInglesSubjectIndex.asObservable();
    }

    public setParalelosIndex(paralelosIndex: any[]): void {
        this.paralelosIndex = paralelosIndex;
        this.paralelosSubjectIndex.next(this.paralelosIndex);
    }

    public getParalelosIndex(): Observable<any[]> {
        return this.paralelosSubjectIndex.asObservable();
    }



    public setHorasDiurnas(horasDirunas: any[]): void {
        this.horasDiurnas = horasDirunas;
        this.horasDiurnasSubject.next(this.horasDiurnas);
    }

    public getHorasDiurnas(): Observable<any[]> {
        return this.horasDiurnasSubject.asObservable();
    }

    public setHorasNocturnas(horasNocturnas: any[]): void {
        this.horasNocturnas = horasNocturnas;
        this.horasNocturnasSubject.next(this.horasNocturnas);
    }

    public getHorasNocturnas(): Observable<any[]> {
        return this.horasNocturnasSubject.asObservable();
    }

    public setHorasAlternativaDiurnas(horasAlternativaDiurnas: any[]): void {
        this.horasAlternativaDiurnas = horasAlternativaDiurnas;
        this.horasAlternativaDiurnasSubject.next(this.horasAlternativaDiurnas);
    }

    public getHorasAlternativaDiurnas(): Observable<any[]> {
        return this.horasAlternativaDiurnasSubject.asObservable();
    }

    public setHorasAlternativaNocturnas(horasAlternativaNocturnas: any[]): void {
        this.horasAlternativaNocturnas = horasAlternativaNocturnas;
        this.horasAlternativaNocturnasSubject.next(this.horasAlternativaNocturnas);
    }

    public getHorasAlternativaNocturnas(): Observable<any[]> {
        return this.horasAlternativaNocturnasSubject.asObservable();
    }

    

    public setParalelos(paralelos: any[]): void {
        this.paralelos = paralelos;
        this.paralelosSubject.next(this.paralelos);
    }

    public getParalelos(): Observable<any[]> {
        return this.paralelosSubject.asObservable();
    }

    public setPeriodosIngles(periodosIngles: any[]): void {
        this.periodosIngles = periodosIngles;
        this.periodosInglesSubject.next(this.periodosIngles);
    }

    public getPeriodosIngles(): Observable<any[]> {
        return this.periodosInglesSubject.asObservable();
    }




    getDetalles(last: any = null): Observable<any> {

        var detalles = 'detalles';

        if (last != null) {
            detalles = 'detalle/true';
        }

        return this._http.get(this.url + detalles);
    }

    getDetalle(detalleId: Detalle): Observable<any> {
        return this._http.get(this.url + 'detalle/' + detalleId);
    }



    create(detalle: Detalle): Observable<any> {
        let params = JSON.stringify(detalle);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url + 'save-detalle', detalle, { headers: headers })
    }

    update(id: string, detalle: Detalle): Observable<any> {
        let params = JSON.stringify(detalle);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url + 'detalle/' + id, params, { headers: headers });
    }

    delete(id: string): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.delete(this.url + 'detalle/' + id, { headers: headers })
    }


}