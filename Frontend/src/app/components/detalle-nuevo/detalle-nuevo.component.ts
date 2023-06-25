import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Detalle } from '../models/detalle';
import { DetalleService } from '../services/detalle.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-detalle-nuevo',
  templateUrl: './detalle-nuevo.component.html',
  styleUrls: ['./detalle-nuevo.component.css'],
  providers: [DetalleService]
})
export class DetalleNuevoComponent {

  public detalle!: Detalle
  public status!: string
  public is_edit!: boolean
  public page_title: string
  public url!: string
  public carrerasForm: FormGroup;
  public periodosInglesForm: FormGroup;
  public horasForm: FormGroup;
  public semestres!: any;
  public ciclos!: any;
  public horasDiurnas!: any[];
  public horasNocturnas!: any[];
  public horaInicio!: any;
  public horaFin!: any;
  public horaInicioA!: any;
  public horaFinA!: any;
  public horaInicioN!: any;
  public horaFinN!: any;
  public horaInicioN1!: any;
  public horaFinN1!: any;
  public horaInicioAN!: any;
  public horaFinAN!: any;
  public horaInicioAN1!: any;
  public horaFinAN1!: any;
  public paraleloInicio!: any;
  public paraleloFin!: any;


  constructor(
    private _route: ActivatedRoute,
    private _detalleService: DetalleService,
    private _router: Router,
    private formBuilder: FormBuilder) {

    this.detalle = new Detalle('',[], [],[], [], [], [], [], [], [])
    this.page_title = "Nuevo Detalle"
    this.is_edit = false;
    this.url = this._detalleService.Global.url



    // Inicializar los formularios y los form controls


    this.carrerasForm = this.formBuilder.group({
      carreras: this.formBuilder.array([])
    });

    this.periodosInglesForm = this.formBuilder.group({
      periodos: this.formBuilder.array([])
    });


    this.horasForm = this.formBuilder.group({
      horas: this.formBuilder.array([])
    });



  }

  ngOnInit() {
    this.agregarCarreras();
    this.agregarPeriodoIngles()
  }


  getCarrerasFormControls() {
    return (this.carrerasForm.get('carreras') as FormArray).controls;
  }

  getperiodosInglesFormControls() {
    return (this.periodosInglesForm.get('periodos') as FormArray).controls;
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

  agregarPeriodoIngles() {
    const periodos = this.periodosInglesForm.get('periodos') as FormArray;
    periodos.push(this.formBuilder.control(''));
  }

  removerPeriodoIngles(index: number) {
    const periodos = this.periodosInglesForm.get('periodos') as FormArray;
    periodos.removeAt(index);
  }





  onSubmit() {

    if (
      this.carrerasForm.invalid || 
      this.periodosInglesForm.invalid
      || this.semestres === undefined || this.ciclos === undefined
      || this.horaInicio === undefined || this.horaFin === undefined
      || this.horaInicioN === undefined || this.horaFinN === undefined
      || this.horaInicioN1 === undefined || this.horaFinN1 === undefined
      || this.horaInicioA === undefined || this.horaFinA === undefined
      || this.horaInicioAN === undefined || this.horaFinAN === undefined
      || this.horaInicioAN1 === undefined || this.horaFinAN1 === undefined) {
      Swal.fire(
        'Detalle no creado',
        'Por favor, rellene los datos correctamente.',
        'error'
      )
    } else {



      let carreras = this.carrerasForm.value.carreras;
      let periodosIngles = this.periodosInglesForm.value.periodos;
      let semestre = this.semestres;
      let semestres: any[] = []
      let ciclo = this.ciclos;
      let ciclos: any[] = []
      let paraleloInicio:any = "" 
      let paraleloFin:any = "" 
      let paralelos: any[] = []
      for (let i = 1; i <= semestre; i++) {
        semestres.push(i.toString())
      }
      for (let i = 1; i <= ciclo; i++) {
        ciclos.push(i.toString())
      }
      for (let i = paraleloInicio; i <= paraleloFin; i++) {
        let letra = String.fromCharCode(i);
        paralelos.push(letra);
      }
      this.detalle.carreras = carreras
      this.detalle.periodoIngles = periodosIngles
      this.detalle.semestres = semestres
      this.detalle.ciclos = ciclos
      this.detalle.paralelos = paralelos





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


      /* HORAS ALTERNATIVAS */
      // Crear un array para almacenar los pares de horas
      let paresHorasA = [];

      // Convertir las horas iniciales y finales en objetos Date
      let horaInicioA = new Date(`1970-01-01T${this.horaInicioA}`);
      let horaFinA = new Date(`1970-01-01T${this.horaFinA}`);

      // Bucle for para generar los pares de horas
      for (let hora = horaInicioA; hora < horaFinA; hora.setHours(hora.getHours() + 1)) {
        let horaActual = hora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        let horaSiguiente = new Date(hora);
        horaSiguiente.setHours(horaSiguiente.getHours() + 1);
        let parHoras = `${horaActual} - ${horaSiguiente.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
        paresHorasA.push(parHoras);
      }

      this.detalle.horasAlternativaDiurnas = paresHorasA
      // Crear un array para almacenar los pares de horas
      let paresHorasNocturnasA = [];

      // Convertir las horas iniciales y finales en objetos Date
      let horaInicioAN = new Date(`1970-01-01T${this.horaInicioAN}`);
      let horaFinAN = new Date(`1970-01-01T${this.horaFinAN}`);
      let horaInicioAN1 = new Date(`1970-01-01T${this.horaInicioAN1}`);
      let horaFinAN1 = new Date(`1970-01-01T${this.horaFinAN1}`);

      // Bucle for para generar los pares de horas
      for (let hora = horaInicioAN; hora < horaFinAN; hora.setHours(hora.getHours() + 1)) {
        let horaActual = hora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        let horaSiguiente = new Date(hora);
        horaSiguiente.setHours(horaSiguiente.getHours() + 1);
        let parHoras = `${horaActual} - ${horaSiguiente.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
        paresHorasNocturnasA.push(parHoras);
      }

      // Bucle for para generar los pares de horas
      for (let hora = horaInicioAN1; hora < horaFinAN1; hora.setHours(hora.getHours() + 1)) {
        let horaActual = hora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        let horaSiguiente = new Date(hora);
        horaSiguiente.setHours(horaSiguiente.getHours() + 1);
        let parHoras = `${horaActual} - ${horaSiguiente.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
        paresHorasNocturnasA.push(parHoras);
      }


      this.detalle.horasAlternativaNocturnas = paresHorasNocturnasA

      this._detalleService.create(this.detalle).subscribe(
        response => {
          if (response.status == 'success') {
            this.status = 'success'
            this.detalle = response.detalle

            Swal.fire(
              'Detalle creada',
              'El detalle se ha creado correctamente.',
              'success'
            )

            setTimeout(() => {
              this._router.navigate(['/especificacion/detalles']);
            }, 1200);
          } else {
            Swal.fire(
              'Detalle no creada',
              'Por favor, rellene los datos correctamente.',
              'error'
            )
            this.status = 'error'
          }
        },
        error => {
          Swal.fire(
            'Detalle no creada',
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
