import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { Global } from "./global";
import { Usuario } from '../models/usuario';

@Injectable()
export class UsuarioService {
    public url: string

    constructor(
        private _http: HttpClient
    ) {
        this.url = Global.url;

    }

    getUsuarios(last:any = null):Observable<any>{

        var usuarios = 'usuarios';

        if(last != null){
            usuarios = 'usuario/true';
        }

        return this._http.get(this.url+usuarios);
    }

    getUsuario(usuarioId:Usuario):Observable<any>{
        return this._http.get(this.url+'usuario/'+usuarioId);
    }

    searchProfesora(searchString:any):Observable<any>{
        return this._http.get(this.url+'searchUsuario/'+searchString)
    }


    create(usuario:Usuario):Observable<any>{
        let params = JSON.stringify(usuario);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url+'save-usuario',usuario,{headers: headers})
    }

    update(id: string, usuario: Usuario):Observable<any>{
        let params = JSON.stringify(usuario);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url+'usuario/'+id, params, {headers: headers});
    }

    delete(id: string):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.delete(this.url+'usuario/'+id, {headers:headers})
    }

}