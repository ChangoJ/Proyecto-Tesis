import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Global } from './../services/global';
import { Asignatura } from './../models/asignatura';
import { Component, Input } from '@angular/core';
import { AsignaturaService } from '../services/asignatura.service';

@Component({
  selector: 'app-items-asignatura',
  templateUrl: './items-asignatura.component.html',
  styleUrls: ['./items-asignatura.component.css'],
  providers: [AsignaturaService]
})
export class ItemsAsignaturaComponent {

  public colorCuadro = document.querySelector(".color-square")
  public url: string
  public asignaturasFiltrados: any[] = [];
  public terminoBusquedaAsignatura: string = '';

  public selectedCarrera!: any
  public selectedSemestre!: any

  @Input() asignaturas!: Asignatura[]
  columnas = ['N°', 'Nombre', 'Carrera', 'Semestre', 'Profesor','Horario', 'Creditos', 'Color', 'Acciones'];
  carreras = ["Enfermeria", "Fisioterapia", "Nutricion", "Psicologia", " Educacion Basica", "Produccion Audiovisual", "Contabilidad", "Derecho", "Economia", "Software", "Administracion de Empresas",
    "Gastronomia", "Turismo"];
  semestres = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", " 12"];
  asignaturasObtenidos: any[] = [];

  constructor(private _asignaturaService: AsignaturaService,
    private _route: ActivatedRoute,
    private _router: Router) {
    this.url = Global.url
  }


  ngOnInit() {
    this._asignaturaService.getAsignaturas().subscribe(
      response => {
        if (response.asignaturas) {
          this.asignaturasObtenidos = response.asignaturas
          this.asignaturasFiltrados = this.asignaturasObtenidos;
        }
      },
      error => {
        console.log(error)
      }
    )

  }

  delete(id: string) {

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'La asignatura se eliminará permanentemente',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this._asignaturaService.delete(id).subscribe(
          (response) => {
            setTimeout(() => {
              location.reload();
            }, 1200);
          },
          (error) => {
            console.log(error);
            this._router.navigate(['/especificacion/asignaturas']);
          }
        );

        Swal.fire('Asignatura borrada', 'La Asignatura ha sido borrado', 'success');
      } else {
        Swal.fire('Operación cancelada', 'La Asignatura no ha sido borrado', 'warning');
      }
    });


  }

  filtrarAsignaturas() {

    const terminosBusqueda = this.terminoBusquedaAsignatura.trim().toLowerCase();

    let asignaturasFiltrados = this.asignaturasObtenidos;

    if (this.selectedCarrera !== undefined) {
      asignaturasFiltrados = asignaturasFiltrados.filter(asignatura => {
        return asignatura.carrera.some((carrera: any) => carrera.toLowerCase() === this.selectedCarrera.toLowerCase());
      });
    }

    if (this.selectedSemestre !== undefined) {
      asignaturasFiltrados = asignaturasFiltrados.filter(asignatura => {
        return asignatura.semestre.some((semestre: any) => semestre.toLowerCase() === this.selectedSemestre.toLowerCase());
      });
    }

    if (this.selectedCarrera === "Todas" || this.selectedSemestre === "Todas") {
      asignaturasFiltrados = this.asignaturasObtenidos;
    }

    if (terminosBusqueda !== '') {
      let regexBusqueda = new RegExp(`\\b${terminosBusqueda}\\b`, 'gi');
      asignaturasFiltrados = asignaturasFiltrados.filter(asignaturas =>
        asignaturas.nombre.toLowerCase().match(regexBusqueda) ||
        asignaturas.profesor[0].nombre.toLowerCase().match(regexBusqueda) ||
        asignaturas.creditos.toString().toLowerCase().match(regexBusqueda) ||
        asignaturas.abreviatura.toLowerCase().match(regexBusqueda) ||
        asignaturas.color.toLowerCase().match(regexBusqueda)
      );

      if (asignaturasFiltrados.length === 0) {
        const terminosBusquedaSeparados = terminosBusqueda.split(' ');
        regexBusqueda = new RegExp(`(${terminosBusquedaSeparados.join('|')})`, 'gi');
        asignaturasFiltrados = this.asignaturasObtenidos.filter(asignaturas =>
          asignaturas.nombre.toLowerCase().match(regexBusqueda) ||
          asignaturas.profesor[0].nombre.toLowerCase().match(regexBusqueda) ||
          asignaturas.creditos.toString().toLowerCase().match(regexBusqueda) ||
          asignaturas.abreviatura.toLowerCase().match(regexBusqueda) ||
          asignaturas.color.toLowerCase().match(regexBusqueda)
        );
      }
    }
    this.asignaturasFiltrados = asignaturasFiltrados;
  }

  allAsignaturas() {
    this._router.navigate(['/especificacion/asignaturas'])
    location.reload();
  }

  redirectEdit(id: any) {
    this._router.navigate(['/especificacion/asignaturas/editarAsignatura/', id])

  }
}
