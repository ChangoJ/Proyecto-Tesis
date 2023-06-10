import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HorarioService } from '../services/horario.service';
import { Horario } from '../models/horario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carreras-dialog',
  templateUrl: './carreras-dialog.component.html',
  styleUrls: ['./carreras-dialog.component.css'],
  providers: [HorarioService]
})
export class CarrerasDialogComponent {
  public datoRecibido!: any;
  public selectedCarrera!: string;
  public selectedSemestre!: string;
  public periodoTIpo!:any

  public horarios: Horario[] = []

  carreras: any[] = [
    { id: 1, textField: 'Enfermeria' },
    { id: 2, textField: 'Fisioterapia' },
    { id: 3, textField: 'Nutricion' },
    { id: 4, textField: 'Psicologia' },
    { id: 5, textField: 'Educacion Basica' },
    { id: 6, textField: 'Produccion Audiovisual' },
    { id: 7, textField: 'Contabilidad' },
    { id: 8, textField: 'Derecho' },
    { id: 9, textField: 'Economia' },
    { id: 10, textField: 'Software' },
    { id: 11, textField: 'Administracion de Empresas' },
    { id: 12, textField: 'Gastronomia' },
    { id: 13, textField: 'Turismo' }
  ];


  semestres: any[] = [
    { id: 1, textField: '1' },
    { id: 2, textField: '2' },
    { id: 3, textField: '3' },
    { id: 4, textField: '4' },
    { id: 5, textField: '5' },
    { id: 6, textField: '6' },
    { id: 7, textField: '7' },
    { id: 8, textField: '8' },
    { id: 9, textField: '9' },
    { id: 10, textField: '10' },
  ];

  ciclos: any[] = [
    { id: 1, textField: '1' },
    { id: 2, textField: '2' },
  ];

  selectedCarreras: any[] = [];

  selectedSemestres: any[] = [];
  dropdownCarreras: IDropdownSettings = {};
  dropdownSemestres: IDropdownSettings = {};


  constructor(
    public dialogRef: MatDialogRef<CarrerasDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _router: Router,
    private _route: ActivatedRoute, private _horarioService: HorarioService) {
      
    

    this.dropdownCarreras = {
      singleSelection: false,
      idField: 'id',
      textField: 'textField',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      itemsShowLimit: 13,
      allowSearchFilter: true
    };

    this.dropdownSemestres = {
      singleSelection: false,
      idField: 'id',
      textField: 'textField',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      itemsShowLimit: 13,
      allowSearchFilter: true
    };

  }

  ngOnInit() {
    this.getHorarios()
    if(this.datoRecibido === "Horarios Nocturnos"){
      this.semestres = this.ciclos
      this.periodoTIpo = "Ciclo"
      }else{
        
      this.periodoTIpo = "Semestre"
      }
    }

  getHorarios() {
    this._horarioService.getHorarios().subscribe(
      response => {
        if (response.horarios) {
          this.horarios = response.horarios;
        }
      },
      error => {
        console.log(error)
      }
    )
  }



  onCarreraSelected() {
    console.log(this.datoRecibido)
    let existHorarioCarrera: boolean = false

    if(this.datoRecibido === "Horarios Nocturnos"){
      this.datoRecibido = "Horario Nocturno"
      this.periodoTIpo = "Ciclo"
    }else{
      this.datoRecibido = "Horario Diurno"
      this.periodoTIpo = "Semestre"
    }

    for (const horario of this.horarios) {
      if (horario.carrera === this.selectedCarrera && horario.semestre === this.selectedSemestre && horario.tipoHorario === this.datoRecibido ) {
        existHorarioCarrera = true
      }
    }
    if (!existHorarioCarrera) {
      let ruta = 'home/creacion/' + this.datoRecibido + '/' + this.selectedCarrera + '/' + this.selectedSemestre
      ruta = ruta.replace(/\s+/g, "_");
      this._router.navigate([ruta], { relativeTo: this._route })
      setTimeout(() => {
        location.reload();
      }, 400);
    } else {
      Swal.fire(
        'EL Horario de ' + this.selectedCarrera + ' del ' + this.selectedSemestre + this.periodoTIpo +' ya existe',
        'Por favor, si desea modificar vaya a la sección de horarios',
        'error'
      )

    }

  }
}
