
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { Global } from "./global";
import { Horario } from "../models/horario";
declare let jsPDF: new () => any;

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  public url: string

  constructor(
    private _http: HttpClient
  ) {
    this.url = Global.url;

  }


  getHorarios(last: any = null): Observable<any> {

    var horarios = 'horarios';

    if (last != null) {
      horarios = 'horario/true';
    }

    return this._http.get(this.url + horarios);
  }

  getHorario(horarioId: Horario): Observable<any> {
    return this._http.get(this.url + 'horario/' + horarioId);
  }

  searchHorario(searchString: any): Observable<any> {
    return this._http.get(this.url + 'searchHorario/' + searchString)
  }


  create(horario: Horario): Observable<any> {
    let params = JSON.stringify(horario);
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
    console.log(params)
    return this._http.post(this.url + 'save-horario', horario, { headers: headers })
  }

  update(id: string, horario: Horario): Observable<any> {
    let params = JSON.stringify(horario);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    console.log(params)
    return this._http.put(this.url + 'horario/' + id, params, { headers: headers });
  }

  delete(id: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.delete(this.url + 'horario/' + id, { headers: headers })
  }
}