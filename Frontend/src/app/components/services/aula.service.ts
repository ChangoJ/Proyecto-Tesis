import { Aula } from './../models/aula';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { Global } from "./global";

@Injectable()
export class AulaService {
    public url: string

    constructor(
        private _http: HttpClient
    ) {
        this.url = Global.url;

    }

    getAulas(last:any = null):Observable<any>{

        var aulas = 'aulas';

        if(last != null){
            aulas = 'aula/true';
        }

        return this._http.get(this.url+aulas);
    }

    getAula(aulaId:Aula):Observable<any>{
        return this._http.get(this.url+'aula/'+aulaId);
    }

    searchAula(searchString:any):Observable<any>{
        return this._http.get(this.url+'searchAula/'+searchString)
    }


    create(aula:Aula):Observable<any>{
        let params = JSON.stringify(aula);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url+'save-aula',aula,{headers: headers})
    }

    update(id: string, aula: Aula):Observable<any>{
        let params = JSON.stringify(aula);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url+'aula/'+id, params, {headers: headers});
    }

    delete(id: string):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.delete(this.url+'aula/'+id, {headers:headers})
    }

}