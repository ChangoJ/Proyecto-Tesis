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
import { AuthGuard } from './components/services/auth.guard';
import { LoginGuard } from './components/services/login.guard';
import { AdminGuard } from './components/services/admin.guard';

const routes: Routes = [
  {
    path: 'login', component: LoginComponent, canActivate: [LoginGuard]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuard]
  },

  {
    path: 'horarios', component: ItemsHorarioComponent, canActivate: [AuthGuard]
  },
  {
    path: 'home/creacion/:opcion1/:opcion2/:opcion3',
    component: HomeComponent, canActivate: [AuthGuard]
  },

  {
    path: 'especificacion', component: EspecificacionComponent, canActivate: [AuthGuard],
    children: [
      {
        path: 'asignaturas',
        component: AsignaturasComponent, canActivate: [AuthGuard]

      },
      {
        path: 'asignaturas/search/:search1/:search2',
        component: AsignaturasComponent, canActivate: [AuthGuard]
      },
      {
        path: 'asignaturas/search/:search',
        component: AsignaturasComponent, canActivate: [AuthGuard]
      },

      {
        path: 'asignaturas/crearAsignatura',
        component: AsignaturaNuevoComponent, canActivate: [AuthGuard]
      },
      {
        path: 'asignaturas/editarAsignatura/:id',
        component: AsignaturaEditComponent, canActivate: [AuthGuard]
      },
      {
        path: 'aulas',
        component: AulasComponent, canActivate: [AuthGuard]

      },
      {
        path: 'aulas/searchAula/:search1',
        component: AulasComponent, canActivate: [AuthGuard]
      },

      {
        path: 'aulas/crearAula',
        component: AulaNuevoComponent, canActivate: [AuthGuard]
      },
      {
        path: 'aulas/editarAula/:id',
        component: AulaEditComponent, canActivate: [AuthGuard]
      },
      {
        path: 'profesores',
        component: ProfesoresComponent, canActivate: [AuthGuard]
      },
      {
        path: 'profesores/resumen-profesores',
        component: ProfesoresResumenComponent, canActivate: [AuthGuard]
      },
      {
        path: 'profesores/searchProfesor/:search1',
        component: ProfesoresComponent, canActivate: [AuthGuard]
      },

      {
        path: 'profesores/editarProfesor/:id',
        component: ProfesorEditComponent, canActivate: [AuthGuard]
      },

      {
        path: 'profesores/crearProfesor',
        component: ProfesorNuevoComponent, canActivate: [AuthGuard]
      },

      {
        path: 'usuarios',
        component: UsuariosComponent, canActivate: [AdminGuard]
      },
      {
        path: 'usuarios/editarUsuario/:id',
        component: UsuarioEditComponent, canActivate: [AdminGuard]
      },

      {
        path: 'usuarios/crearUsuario',
        component: UsuarioNuevoComponent, canActivate: [AdminGuard]
      }
    ]
  },
  { path: 'horarios/editarHorario/:id', component: HorarioComponent, canActivate: [AuthGuard] },
  { path: '**', component: ErrorComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
