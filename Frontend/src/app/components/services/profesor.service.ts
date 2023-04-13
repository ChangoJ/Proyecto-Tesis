import { Profesor } from './../models/profesor';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { Global } from "./global";

@Injectable()
export class ProfesorService {
    public url: string

    constructor(
        private _http: HttpClient
    ) {
        this.url = Global.url;

    }

    getProfesores(last:any = null):Observable<any>{

        var profesores = 'profesores';

        if(last != null){
            profesores = 'profesor/true';
        }

        return this._http.get(this.url+profesores);
    }

    getProfesor(profesorId:Profesor):Observable<any>{
        return this._http.get(this.url+'profesor/'+profesorId);
    }

    searchProfesora(searchString:any):Observable<any>{
        return this._http.get(this.url+'searchProfesor/'+searchString)
    }


    create(profesor:Profesor):Observable<any>{
        let params = JSON.stringify(profesor);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        console.log(params)
        return this._http.post(this.url+'save-profesor',profesor,{headers: headers})
    }

    update(id: string, profesor: Profesor):Observable<any>{
        let params = JSON.stringify(profesor);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        console.log(params)
        return this._http.put(this.url+'profesor/'+id, params, {headers: headers});
    }

    delete(id: string):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.delete(this.url+'profesor/'+id, {headers:headers})
    }

}