import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { Global } from "./global";
import { Usuario } from '../models/usuario';
import { response } from "express";

@Injectable()
export class UsuarioService {
    public url: string
    private userData: any;
    public datosUsuario:any
    constructor(
        private _http: HttpClient
    ) {
        this.url = Global.url;
        
        this.datosUsuario = localStorage.getItem('datosUsuario') || '';
    }

    getUsuarios(last: any = null): Observable<any> {

        var usuarios = 'usuarios';

        if (last != null) {
            usuarios = 'usuario/true';
        }

        return this._http.get(this.url + usuarios);
    }

    getUsuario(usuarioId: any): Observable<any> {
        return this._http.get(this.url + 'usuario/' + usuarioId);
    }

    setUserData(userData: Usuario): void {
        const userDataString = JSON.stringify(userData);
        localStorage.setItem('datosUsuario', userDataString);
        const hey = JSON.parse(userDataString);
        console.log(hey.nombre)
    }

    searchProfesora(searchString: any): Observable<any> {
        return this._http.get(this.url + 'searchUsuario/' + searchString)
    }


    create(usuario: Usuario): Observable<any> {
        let params = JSON.stringify(usuario);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url + 'save-usuario', usuario, { headers: headers })
    }

    update(id: string, usuario: Usuario): Observable<any> {
        let params = JSON.stringify(usuario);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url + 'usuario/' + id, params, { headers: headers });
    }

    delete(id: string): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.delete(this.url + 'usuario/' + id, { headers: headers })
    }

    decodeToken(token: string): any {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedData = JSON.parse(atob(base64));
        return decodedData;
    }
}