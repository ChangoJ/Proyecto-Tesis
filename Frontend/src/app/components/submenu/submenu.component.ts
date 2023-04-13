import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HorarioDialogComponent } from '../horario-dialog/horario-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CarrerasDialogComponent } from '../carreras-dialog/carreras-dialog.component';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.css']
})
export class SubmenuComponent {

  public rutaActual!: String
  public home!: boolean
  public especificacion!: boolean
  public horario!: boolean

  constructor(private _route: ActivatedRoute, private dialog: MatDialog,
    private _router: Router) {
    this.home = false;
    this.especificacion = false;
    this.horario = false;

  }

  ngOnInit(): void {
    this.rutaActual = this._router.url

    if (this.rutaActual.includes("/especificacion")) {
      this.especificacion = true;
    } else if (this.rutaActual.includes("/horario")) {
      this.horario = true;
    } else if (this.rutaActual.includes("/home") || this.rutaActual.includes("")) {
      this.home = true;

    }

  }

  asignaturas() {
    this._router.navigate(['asignaturas'], { relativeTo: this._route });
  }

  openHorarioDialog(): void {
    const dialogRef = this.dialog.open(HorarioDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.openCarrerasDialog(result); // Pasar el valor al método openCarrerasDialog()
      }
    });
  }

  openCarrerasDialog(valor: any): void { // Recibir el valor como parámetro
    const dialogRef = this.dialog.open(CarrerasDialogComponent, {
      width: '500px'
    });
    // Utilizar el valor en el componente CarrerasDialogComponent como necesites
    dialogRef.componentInstance.datoRecibido = valor;
  }

  openGuardarDialog(){
    const dialogRef = this.dialog.open(HorarioDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.openCarrerasDialog(result); // Pasar el valor al método openCarrerasDialog()
      }
    });
  }

}

