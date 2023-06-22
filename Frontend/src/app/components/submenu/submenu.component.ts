import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HorarioDialogComponent } from '../horario-dialog/horario-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CarrerasDialogComponent } from '../carreras-dialog/carreras-dialog.component';
import { BDService } from '../services/BD.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.css'],
  providers: [BDService]
})
export class SubmenuComponent {

  public rutaActual!: String
  public home!: boolean
  public especificacion!: boolean
  public horario!: boolean
  public is_admin!: boolean
  public is_suAdmin!: boolean

  constructor(private _route: ActivatedRoute, private dialog: MatDialog,
    private _router: Router, private _bdService: BDService) {
    this.home = false;
    this.especificacion = false;
    this.horario = false;
    this.is_admin = false
    this.is_suAdmin = false

  }

  ngOnInit() {
    this.rutaActual = this._router.url

    if (this.rutaActual.includes("/especificacion")) {
      this.especificacion = true;
    } else if (this.rutaActual.includes("/horario")) {
      this.horario = true;
    } else if (this.rutaActual.includes("/home") || this.rutaActual.includes("")) {
      this.home = true;
    }
    let authToken = localStorage.getItem('datosUsuario');
    let UserData = JSON.parse(authToken!)
    if (UserData.rol === "Administrador" || UserData.rol === "Superadministrador") {
      this.is_admin = true
    }

    if (UserData.rol === "Superadministrador") {
      this.is_suAdmin = true
    }

  }

  asignaturas() {
    this._router.navigate(['asignaturas'], { relativeTo: this._route });
  }

  irCrearHorario() {
    this._router.navigate(['/home']);
    setTimeout(() => {
      this.openHorarioDialog()
    }, 300);
  }

  verHorarios() {
    this._router.navigate(['/horarios']);

    if (!this.rutaActual.includes("editarHorarios")) {

      this._router.navigate(['/horarios']);
    }
    if (this.rutaActual === "/horarios") {
      location.reload();
    }

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

  openGuardarDialog() {
    const dialogRef = this.dialog.open(HorarioDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.openCarrerasDialog(result); // Pasar el valor al método openCarrerasDialog()
      }
    });
  }


  exportarBD() {

    this._bdService.exportarDatos().subscribe(
      response => {
        console.log(response)
        Swal.fire(
          'Exportado Correctamente',
          response.message,
          'success'
        )
      },
      error => {
        Swal.fire(
          'Exportación fallida',
          error.error.message,
          'error'
        )
      })


  }


  importarBD(event: any) {
    const file: File = event.target.files[0];
    console.log(file)

    if (file) {
      this._bdService.importarDatos(file).subscribe(
        (response) => {
          Swal.fire(
            'Importado Correctamente',
            response.message,
            'success'
          )
        },
        (error) => {
          Swal.fire(
            'Importación fallida',
            error.error.message,
            'error'
          )
        }
      );
    }
  }

}

