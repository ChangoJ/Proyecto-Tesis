
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { Global } from "./global";
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

    generarPdf(horario: any[], asignaturas: any[], aulas: any[]) {
        const doc = new jsPDF();
    
        // Encabezado del PDF
        doc.setFontSize(18);
        doc.text('Horario', 10, 10);
        doc.setFontSize(12);
        doc.text('Asignaturas:', 10, 20);
        doc.setFontSize(10);
        let asignaturasText = '';
        asignaturas.forEach(asignatura => {
          asignaturasText += asignatura.nombre + ', ';
        });
        doc.text(asignaturasText, 10, 25);
        doc.setFontSize(12);
        doc.text('Aulas:', 10, 35);
        doc.setFontSize(10);
        let aulasText = '';
        aulas.forEach(aula => {
          aulasText += aula.nombre + ', ';
        });
        doc.text(aulasText, 10, 40);
    
        // Contenido del PDF
        doc.setFontSize(10);
        const columns = ['Hora', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
        const data: any[][] = [];
        horario.forEach(hora => {
          const row = [
            hora.hour,
            this.getAsignaturaNombre(hora.monday, asignaturas),
            this.getAsignaturaNombre(hora.tuesday, asignaturas),
            this.getAsignaturaNombre(hora.wednesday, asignaturas),
            this.getAsignaturaNombre(hora.thursday, asignaturas),
            this.getAsignaturaNombre(hora.friday, asignaturas)
          ];
          data.push(row);
        });
    
        // Generar tabla en el PDF
        doc.autoTable({
          head: [columns],
          body: data,
          startY: 50
        });
    
        // Guardar el PDF como archivo
        doc.save('horario.pdf');
      }
    
      getAsignaturaNombre(id: number, asignaturas: any[]): string {
        const asignatura = asignaturas.find(asignatura => asignatura.id === id);
        return asignatura ? asignatura.nombre : '';
      }
}