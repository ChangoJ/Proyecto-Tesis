import { Component,EventEmitter,Inject, Output  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-horario-dialog',
  templateUrl: './horario-dialog.component.html',
  styleUrls: ['./horario-dialog.component.css']
})
export class HorarioDialogComponent {

  
  constructor(
    public dialogRef: MatDialogRef<HorarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onOptionSelected(option: string): void {
    this.dialogRef.close(option);

  }
}
