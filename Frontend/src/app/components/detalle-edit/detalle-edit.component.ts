import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DetalleService } from '../services/detalle.service';
import Swal from 'sweetalert2';
import { Detalle } from '../models/detalle';


@Component({
  selector: 'app-detalle-edit',
  templateUrl: '../detalle-nuevo/detalle-nuevo.component.html',
  styleUrls: ['./detalle-edit.component.css'],
  providers: [DetalleService]
})
export class DetalleEditComponent {
  public horasForm: FormGroup;
  public carrerasForm: FormGroup;
  public semestres!: any;
  public ciclos!: any;
  public rolesData!: any[];
  public tiposHorarioData !: any[];
  public carrerasData!: any[];
  public ubicacionesData !: any[];
  public semestresData!: any;
  public ciclosData!: any;
  public horasDiurnasDesdeData!: any;
  public horasDiurnasHastaData!: any;
  public horasNocturnasDesdeData!: any;
  public horasNocturnasHastaData!: any;
  public horasNocturnasDesde2Data!: any;
  public horasNocturnasHasta2Data!: any;

  public horaInicio!: any;
  public horaFin!: any;
  public horaInicioN!: any;
  public horaFinN!: any;
  public horaInicioN1!: any;
  public horaFinN1!: any;
  public detalle!: Detalle
  public status!: string
  public is_edit!: boolean
  public page_title: string
  public url!: string

  constructor(
    private _route: ActivatedRoute,
    private _detalleService: DetalleService,
    private _router: Router, private formBuilder: FormBuilder) {

    this.detalle = new Detalle('', [], [], [], [], [])
    this.page_title = "Editar Detalle"
    this.is_edit = false;
    this.url = this._detalleService.Global.url




    this.carrerasForm = this.formBuilder.group({
      carreras: this.formBuilder.array([])
    });

    this.horasForm = this.formBuilder.group({
      horas: this.formBuilder.array([])
    });

  }

  async ngOnInit() {

    await this.getDetalles()
  }

  getDetalles() {
    this._route.params.subscribe(params => {
      let id = params['id'];
      this._detalleService.getDetalle(id).subscribe(
        response => {
          if (response.detalle) {
            this.detalle = response.detalle


            this.carrerasData = this.detalle.carreras
            this.semestresData = this.detalle.semestres[this.detalle.semestres.length - 1]
            this.ciclosData = this.detalle.ciclos[this.detalle.ciclos.length - 1]
            this.horasDiurnasDesdeData = this.detalle.horasDiurnas[0]
            this.horasDiurnasHastaData = this.detalle.horasDiurnas[this.detalle.horasDiurnas.length - 1]
            this.horasNocturnasDesdeData = this.detalle.horasNocturnas[0]
            this.horasNocturnasHasta2Data = this.detalle.horasNocturnas[this.detalle.horasNocturnas.length - 1]
          
            this.inicializarFormularios();

          } else {
            this._router.navigate(['/especificacion/detalles'], { relativeTo: this._route });
          }
        },
        error => {
          this._router.navigate(['/especificacion/detalles'], { relativeTo: this._route });
        }
      )
    }
    )
  }
  // ...

  inicializarFormularios() {
    this.inicializarCarrerasForm();

    this.semestres = this.semestresData;

    this.ciclos = this.ciclosData;
    let partesD = this.horasDiurnasDesdeData.split("-");
    let partesD2 = this.horasDiurnasHastaData.split("-");
    let partesN = this.horasNocturnasDesdeData.split("-");
    let partesN2 = this.horasNocturnasHasta2Data.split("-");
    this.horaInicio = partesD[0].trim();
    this.horaFin = partesD2[1].trim();
    this.horaInicioN = partesN[0].trim();
    this.horaFinN1 = partesN2[1].trim();
  }



  inicializarCarrerasForm() {
    const carrerasArray = this.carrerasForm.get('carreras') as FormArray;
    this.carrerasData.forEach(carrera => {
      const control = new FormControl(carrera);
      carrerasArray.push(control);
    });
  }



  getCarrerasFormControls() {
    return (this.carrerasForm.get('carreras') as FormArray).controls;
  }

  getHorasFormControls() {
    return (this.horasForm.get('horas') as FormArray).controls;
  }


  agregarCarreras() {
    const carreras = this.carrerasForm.get('carreras') as FormArray;
    carreras.push(this.formBuilder.control(''));
  }


  removerCarreras(index: number) {
    const carreras = this.carrerasForm.get('carreras') as FormArray;
    carreras.removeAt(index);
  }

  agregarHoras() {
    const horas = this.horasForm.get('horas') as FormArray;
    horas.push(this.formBuilder.control(''));
  }

  removerHoras(index: number) {
    const horas = this.horasForm.get('horas') as FormArray;
    horas.removeAt(index);
  }




  onSubmit() {

    if (this.horasForm.invalid
      || this.carrerasForm.invalid
      || this.semestres === undefined || this.ciclos === undefined
      || this.horaInicio === undefined || this.horaFin === undefined
      || this.horaInicioN === undefined
      || this.horaFinN1 === undefined) {
      Swal.fire(
        'Detalle no creado',
        'Por favor, rellene los datos correctamente.',
        'error'
      )
    } else {


      let carreras = this.carrerasForm.value.carreras;
      let semestre = this.semestres;
      let semestres: any[] = []
      let ciclo = this.ciclos;
      let ciclos: any[] = []
      for (let i = 1; i <= semestre; i++) {
        semestres.push(i.toString())
      }
      for (let i = 1; i <= ciclo; i++) {
        ciclos.push(i.toString())
      }
      this.detalle.carreras = carreras
      this.detalle.semestres = semestres
      this.detalle.ciclos = ciclos
      // Crear un array para almacenar los pares de horas
      let paresHoras = [];

      // Convertir las horas iniciales y finales en objetos Date
      let horaInicio = new Date(`1970-01-01T${this.horaInicio}`);
      let horaFin = new Date(`1970-01-01T${this.horaFin}`);

      // Bucle for para generar los pares de horas
      for (let hora = horaInicio; hora < horaFin; hora.setHours(hora.getHours() + 1)) {
        let horaActual = hora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        let horaSiguiente = new Date(hora);
        horaSiguiente.setHours(horaSiguiente.getHours() + 1);
        let parHoras = `${horaActual} - ${horaSiguiente.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
        paresHoras.push(parHoras);
      }

      this.detalle.horasDiurnas = paresHoras
      if( this.horaFinN !== undefined|| this.horaInicioN1 !== undefined ){
      
      // Crear un array para almacenar los pares de horas
      let paresHorasNocturnas = [];

      // Convertir las horas iniciales y finales en objetos Date
      let horaInicioN = new Date(`1970-01-01T${this.horaInicioN}`);
      let horaFinN = new Date(`1970-01-01T${this.horaFinN}`);
      let horaInicioN1 = new Date(`1970-01-01T${this.horaInicioN1}`);
      let horaFinN1 = new Date(`1970-01-01T${this.horaFinN1}`);

      // Bucle for para generar los pares de horas
      for (let hora = horaInicioN; hora < horaFinN; hora.setHours(hora.getHours() + 1)) {
        let horaActual = hora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        let horaSiguiente = new Date(hora);
        horaSiguiente.setHours(horaSiguiente.getHours() + 1);
        let parHoras = `${horaActual} - ${horaSiguiente.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
        paresHorasNocturnas.push(parHoras);
      }

      // Bucle for para generar los pares de horas
      for (let hora = horaInicioN1; hora < horaFinN1; hora.setHours(hora.getHours() + 1)) {
        let horaActual = hora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        let horaSiguiente = new Date(hora);
        horaSiguiente.setHours(horaSiguiente.getHours() + 1);
        let parHoras = `${horaActual} - ${horaSiguiente.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
        paresHorasNocturnas.push(parHoras);
      }

      this.detalle.horasNocturnas = paresHorasNocturnas
  
    }
      this._detalleService.update(this.detalle._id, this.detalle).subscribe(
        response => {
          if (response.status == 'success') {
            this.detalle = response.detalle

            Swal.fire(
              'Detalle modificada',
              'El detalle se ha modificada correctamente.',
              'success'
            )

            setTimeout(() => {
              this._router.navigate(['/especificacion/detalles']);
            }, 1200);
          } else {
            Swal.fire(
              'Detalle no se ha modificada',
              'Por favor, rellene los datos correctamente.',
              'error'
            )
            setTimeout(() => {
              location.reload();
            }, 1200);
          }
        },
        error => {
          Swal.fire(
            'Detalle no modificado',
            error,
            'error'
          )
        }
      )
    }
  }



  redirectDetalle() {
    this._router.navigate(['/especificacion/detalles'], { relativeTo: this._route });
  }

  allDetalles() {
    this._router.navigate(['/especificacion/detalles'])
  }


}
