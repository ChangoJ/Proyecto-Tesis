import { Global } from './global';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public url: string;
    public authToken: string;

    constructor(
        private _http: HttpClient
    ) {
        this.url = Global.url;
        this.authToken = localStorage.getItem('authToken') || '';

    }

    login(username: string, password: string): Observable<any> {
        const body = { username, password };
        return this._http.post(this.url + 'login', body).pipe(map((response: any) => {
            if (response && response.token) {
                this.setAuthToken(response.token);
                
            }
            return response
        }))
    }

    setAuthToken(token: string) {
        localStorage.setItem('authToken', token);
    }

    logout(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('datosUsuario');
    }
}