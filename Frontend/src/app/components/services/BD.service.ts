
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { DetalleService } from "./detalle.service";

@Injectable()
export class BDService {

    public url: string

    constructor(
        private _http: HttpClient,
        private _detalleService: DetalleService
    ) {
        this.url = this._detalleService.Global.url;

    }


    exportarDatos(): Observable<any> {
        return this._http.get(this.url+'exportar/');
    }

    importarDatos(file: File): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json'); // Configura el encabezado Content-Type como application/json
      
        return this._http.post(this.url + 'importar/', file, { headers });
      }
}