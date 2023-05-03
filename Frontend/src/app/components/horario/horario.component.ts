import { Component, Input } from '@angular/core';
import  jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})
export class HorarioComponent {

  exportToPDF() {
    const data = document.getElementById('my-table');
    html2canvas(data!).then(canvas => {
      const imgWidth = 210; // Ancho de la imagen en mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('horario.pdf');
    });
  }

}