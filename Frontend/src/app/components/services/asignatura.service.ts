import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { Asignatura } from "../models/asignatura";
import { DetalleService } from '../services/detalle.service';

@Injectable()
export class AsignaturaService {
    public url: string

    constructor(
        private _http: HttpClient,
        private _detalleService: DetalleService
    ) {
        this.url = this._detalleService.Global.url;

    }

    getAsignaturas(last:any = null):Observable<any>{

        var asignaturas = 'asignaturas';

        if(last != null){
            asignaturas = 'asignatura/true';
        }

        return this._http.get(this.url+asignaturas);
    }

    getAsignatura(asignaturaId:Asignatura):Observable<any>{
        return this._http.get(this.url+'asignatura/'+asignaturaId);
    }

    search(searchString:any,search2String:any):Observable<any>{
        return this._http.get(this.url+'search/'+searchString+'/'+search2String)
    }

    searchThree(searchString:any,search2String:any,search3String:any ):Observable<any>{
        return this._http.get(this.url+'searchThree/'+searchString+'/'+search2String+'/'+search3String)
    }

    searchFour(searchString:any,search2String:any,search3String:any,search4String:any ):Observable<any>{
        return this._http.get(this.url+'searchFour/'+searchString+'/'+search2String+'/'+search3String+'/'+search4String)
    }


    searchOne(searchString:any):Observable<any>{
        return this._http.get(this.url+'searchOne/'+searchString)
    }

    create(asignatura:Asignatura):Observable<any>{
        let params = JSON.stringify(asignatura);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url+'save-for-profesor',params,{headers: headers})
    }

    update(id: string, asignatura: Asignatura):Observable<any>{
        let params = JSON.stringify(asignatura);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url+'asignatura/'+id, params, {headers: headers});
    }

    delete(id: string):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.delete(this.url+'asignatura/'+id, {headers:headers})
    }

}