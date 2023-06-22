
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
    public ciclos: any[] = []
    public carreras: any[] = []
    public roles: any = []
    public rolesIndex: any[] = []
    public ciclosIndex: any[] = []
    public carrerasIndex: any[] = []
    public semestresIndex: any[] = []
    private rolesSubject = new BehaviorSubject<any[]>([]);
    private carrerasSubject = new BehaviorSubject<any[]>([]);
    private semestresSubject = new BehaviorSubject<any[]>([]);
    private ciclosSubject = new BehaviorSubject<any[]>([]);
    private rolesSubjectIndex = new BehaviorSubject<any[]>([]);
    private carrerasSubjectIndex = new BehaviorSubject<any[]>([]);
    private semestresSubjectIndex = new BehaviorSubject<any[]>([]);
    private ciclosSubjectIndex = new BehaviorSubject<any[]>([]);
    private horasDiurnasSubject = new BehaviorSubject<any[]>([]);
    private horasNocturnasSubject = new BehaviorSubject<any[]>([]);

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
                this.carreras = []
                this.semestres = []
                this.ciclos = []
                this.carrerasIndex = []
                let rolesCarreras = []
                let rolesCarrerasDic = []
                let rolesCarrerasDiccionario: any = []
                this.horasDiurnas = resultado.detalles[0].horasDiurnas;
                this.horasNocturnas = resultado.detalles[0].horasNocturnas

                carreras = resultado.detalles[0].carreras;
                semestres = resultado.detalles[0].semestres;
                ciclos = resultado.detalles[0].ciclos;
                rolesCarreras = resultado.detalles[0].carreras;
                rolesCarrerasDic = resultado.detalles[0].carreras;
                this.setCarreras(carreras);
                this.setSemestres(semestres);
                this.setCiclos(ciclos);

                this.carrerasIndex = carreras.map((carrera: any, index: number) => {
                    return { id: index + 1, textField: carrera };
                });

                this.semestresIndex = semestres.map((semestre: any, index: number) => {
                    return { id: index + 1, textField: semestre };
                });

                this.ciclosIndex = ciclos.map((ciclo: any, index: number) => {
                    return { id: index + 1, textField: ciclo };
                });


                this.roles = [
                    { id: 1, textField: 'Superadministrador' },
                    { id: 2, textField: 'Administrador' },
                    { id: 3, textField: 'Revisador' },
                    { id: 4, textField: 'Aprobador' },
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

                this.setHorasDiurnas(this.horasDiurnas)
                this.setHorasNocturnas(this.horasNocturnas)

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