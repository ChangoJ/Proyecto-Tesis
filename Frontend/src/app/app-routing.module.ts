import { ProfesoresResumenComponent } from './components/profesores-resumen/profesores-resumen.component';
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
import { ItemsHorarioComponent } from './components/items-horario/items-horario.component';
import { HorarioEditComponent } from './components/horario-edit/horario-edit.component';
import { LoginComponent } from './components/login/login.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { UsuarioEditComponent } from './components/usuario-edit/usuario-edit.component';
import { UsuarioNuevoComponent } from './components/usuario-nuevo/usuario-nuevo.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home', component: HomeComponent
  },

  {
    path: 'horarios', component: ItemsHorarioComponent
  },
  {
    path: 'home/creacion/:opcion1/:opcion2/:opcion3',
    component: HomeComponent,
  },

  {
    path: 'especificacion', component: EspecificacionComponent,
    children: [
      {
        path: 'asignaturas',
        component: AsignaturasComponent,

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
        path: 'asignaturas/crearAsignatura',
        component: AsignaturaNuevoComponent
      },
      {
        path: 'asignaturas/editarAsignatura/:id',
        component: AsignaturaEditComponent
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
        path: 'aulas/crearAula',
        component: AulaNuevoComponent
      },
      {
        path: 'aulas/editarAula/:id',
        component: AulaEditComponent
      },
      {
        path: 'profesores',
        component: ProfesoresComponent
      },
      {
        path: 'profesores/resumen-profesores',
        component: ProfesoresResumenComponent
      },
      {
        path: 'profesores/searchProfesor/:search1',
        component: ProfesoresComponent,
      },

      {
        path: 'profesores/editarProfesor/:id',
        component: ProfesorEditComponent
      },

      {
        path: 'profesores/crearProfesor',
        component: ProfesorNuevoComponent
      },
      
      {
        path: 'usuarios',
        component: UsuariosComponent
      },
      {
        path: 'usuarios/editarUsuario/:id',
        component: UsuarioEditComponent
      },

      {
        path: 'usuarios/crearUsuario',
        component: UsuarioNuevoComponent
      }
    ]
  },
  { path: 'horarios/editarHorario/:id', component: HorarioComponent },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
