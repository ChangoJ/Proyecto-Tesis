import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { FormsModule } from '@angular/forms';
import { SubmenuComponent } from './components/submenu/submenu.component';
import { EspecificacionComponent } from './components/especificacion/especificacion.component';
import { HorarioComponent } from './components/horario/horario.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorComponent } from './components/error/error.component';
import { HorarioNuevoComponent } from './components/horario-nuevo/horario-nuevo.component';
import { HorarioEditComponent } from './components/horario-edit/horario-edit.component';
import { AsignaturaNuevoComponent } from './components/asignatura-nuevo/asignatura-nuevo.component';
import { AsignaturaEditComponent } from './components/asignatura-edit/asignatura-edit.component';
import { AulaNuevoComponent } from './components/aula-nuevo/aula-nuevo.component';
import { AulaEditComponent } from './components/aula-edit/aula-edit.component';
import { ProfesorNuevoComponent } from './components/profesor-nuevo/profesor-nuevo.component';
import { ProfesorEditComponent } from './components/profesor-edit/profesor-edit.component';
import { AsignaturasComponent } from './components/asignaturas/asignaturas.component';
import { AulasComponent } from './components/aulas/aulas.component';
import { ProfesoresComponent } from './components/profesores/profesores.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ItemsAulaComponent } from './components/items-aula/items-aula.component';
import { ItemsProfesorComponent } from './components/items-profesor/items-profesor.component';
import { ItemsAsignaturaComponent } from './components/items-asignatura/items-asignatura.component';
import { HttpClientModule } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HorarioDialogComponent } from './components/horario-dialog/horario-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CarrerasDialogComponent } from './components/carreras-dialog/carreras-dialog.component';
import { ItemsHorarioComponent } from './components/items-horario/items-horario.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ProfesoresResumenComponent } from './components/profesores-resumen/profesores-resumen.component';
import {MatDividerModule} from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LoginComponent } from './components/login/login.component';
import { MatCardModule } from '@angular/material/card';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ItemsUsuarioComponent } from './components/items-usuario/items-usuario.component';
import { UsuarioEditComponent } from './components/usuario-edit/usuario-edit.component';
import { UsuarioNuevoComponent } from './components/usuario-nuevo/usuario-nuevo.component';
import { AuthService } from './components/services/auth.service';
import { HorarioObservacionDialogComponent } from './components/horario-observacion-dialog/horario-observacion-dialog.component';

@NgModule({
  
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    SubmenuComponent,
    EspecificacionComponent,
    HorarioComponent,
    ErrorComponent,
    HorarioNuevoComponent,
    HorarioEditComponent,
    AsignaturaNuevoComponent,
    AsignaturaEditComponent,
    AulaNuevoComponent,
    AulaEditComponent,
    ProfesorNuevoComponent,
    ProfesorEditComponent,
    AsignaturasComponent,
    AulasComponent,
    ProfesoresComponent,
    SidebarComponent,
    ItemsAulaComponent,
    ItemsProfesorComponent,
    ItemsAsignaturaComponent,
    HorarioDialogComponent,
    CarrerasDialogComponent,
    ItemsHorarioComponent,
    ProfesoresResumenComponent,
    LoginComponent,
    UsuariosComponent,
    ItemsUsuarioComponent,
    UsuarioEditComponent,
    UsuarioNuevoComponent,
    HorarioObservacionDialogComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatIconModule,
    NgMultiSelectDropDownModule,
    DragDropModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatTableModule,
    MatGridListModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatDividerModule,
    MatPaginatorModule,
    MatCardModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
