import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-horario-observacion-dialog',
  templateUrl: './horario-observacion-dialog.component.html',
  styleUrls: ['./horario-observacion-dialog.component.css']
})
export class HorarioObservacionDialogComponent {
  result: any;
  observacion: string;

  constructor(
    private dialogRef: MatDialogRef<HorarioObservacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    // Accediendo al valor de observacion desde los datos del diálogo
    this.observacion = data;
  }
}
