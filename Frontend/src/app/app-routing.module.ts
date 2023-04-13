import { ItemsAsignaturaComponent } from './components/items-asignatura/items-asignatura.component';
import { ProfesorEditComponent } from './components/profesor-edit/profesor-edit.component';
import { ProfesorNuevoComponent } from './components/profesor-nuevo/profesor-nuevo.component';
import { AulaNuevoComponent } from './components/aula-nuevo/aula-nuevo.component';
import { AulaEditComponent } from './components/aula-edit/aula-edit.component';
import { AsignaturaNuevoComponent } from './components/asignatura-nuevo/asignatura-nuevo.component';
import { AsignaturaEditComponent } from './components/asignatura-edit/asignatura-edit.component';
import { ProfesoresComponent } from './components/profesores/profesores.component';
import { AulasComponent } from './components/aulas/aulas.component';
import { ErrorComponent } from './components/error/error.component';
import { AsignaturasComponent } from './components/asignaturas/asignaturas.component';
import { EspecificacionComponent } from './components/especificacion/especificacion.component';
import { HorarioComponent } from './components/horario/horario.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'home', component: HomeComponent
  },

  {
    path: 'home/creacion/:opcion1/:opcion2',
    component: HomeComponent,
  },

  {
    path: 'especificacion', component: EspecificacionComponent,
    children: [
      {
        path: 'asignaturas',
        component: AsignaturasComponent,
        /* children:[
          {
            path: 'asignaturas/:opcion1/:opcion2',
           component: ItemsAsignaturaComponent,
          }
        ] */
      },
      {
        path: 'asignaturas/search/:search1/:search2',
        component: AsignaturasComponent,
      },
      {
        path: 'asignaturas/search/:search',
        component: AsignaturasComponent,
      },
      {
        path: 'aulas',
        component: AulasComponent,

      },
      {
        path: 'aulas/searchAula/:search1',
        component: AulasComponent,
      },
      {
        path: 'profesores',
        component: ProfesoresComponent
      },
      {
        path: 'profesores/searchProfesor/:search1',
        component: ProfesoresComponent,
      }
    ]
  },
  { path: 'especificacion/asignaturas/crearAsignatura', component: AsignaturaNuevoComponent },
  { path: 'especificacion/asignaturas/editarAsignatura/:id', component: AsignaturaEditComponent },
  { path: 'especificacion/aulas/crearAula', component: AulaNuevoComponent },
  { path: 'especificacion/aulas/editarAula/:id', component: AulaEditComponent },
  { path: 'especificacion/profesores/crearProfesor', component: ProfesorNuevoComponent },
  { path: 'especificacion/profesores/editarProfesor/:id', component: ProfesorEditComponent },
  { path: 'horarios', component: HomeComponent },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
