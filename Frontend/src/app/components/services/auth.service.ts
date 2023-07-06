
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DetalleService } from './detalle.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public url: string;
    public authToken: string;
    private lastActivityTime!: number;

    constructor(
        private _http: HttpClient,
        private _detalleService: DetalleService,
        private _router: Router,
    ) {
        this.url = this._detalleService.Global.url;
        this.authToken = localStorage.getItem('authToken') || '';

    }

    sendCode(username: string, password: string): Observable<any> {
        const body = { username, password };
        return this._http.post(this.url + 'sendCode', body).pipe(map((response: any) => {

            return response
        }))
    }

    verifyCode(code: string): Observable<any> {
        const body = { code };
        return this._http.post(this.url + 'verifyCode', body).pipe(map((response: any) => {
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