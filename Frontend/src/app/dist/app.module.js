"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var router_1 = require("@angular/router");
var platform_browser_1 = require("@angular/platform-browser");
var app_component_1 = require("./app.component");
var footer_component_1 = require("./components/footer/footer.component");
var header_component_1 = require("./components/header/header.component");
var core_1 = require("@angular/core");
var icon_1 = require("@angular/material/icon");
var app_routing_module_1 = require("./app-routing.module");
var home_component_1 = require("./components/home/home.component");
var forms_1 = require("@angular/forms");
var submenu_component_1 = require("./components/submenu/submenu.component");
var especificacion_component_1 = require("./components/especificacion/especificacion.component");
var horario_component_1 = require("./components/horario/horario.component");
var animations_1 = require("@angular/platform-browser/animations");
var error_component_1 = require("./components/error/error.component");
var horario_nuevo_component_1 = require("./components/horario-nuevo/horario-nuevo.component");
var horario_edit_component_1 = require("./components/horario-edit/horario-edit.component");
var asignatura_nuevo_component_1 = require("./components/asignatura-nuevo/asignatura-nuevo.component");
var asignatura_edit_component_1 = require("./components/asignatura-edit/asignatura-edit.component");
var aula_nuevo_component_1 = require("./components/aula-nuevo/aula-nuevo.component");
var aula_edit_component_1 = require("./components/aula-edit/aula-edit.component");
var profesor_nuevo_component_1 = require("./components/profesor-nuevo/profesor-nuevo.component");
var profesor_edit_component_1 = require("./components/profesor-edit/profesor-edit.component");
var asignaturas_component_1 = require("./components/asignaturas/asignaturas.component");
var aulas_component_1 = require("./components/aulas/aulas.component");
var profesores_component_1 = require("./components/profesores/profesores.component");
var sidebar_component_1 = require("./components/sidebar/sidebar.component");
var items_aula_component_1 = require("./components/items-aula/items-aula.component");
var items_profesor_component_1 = require("./components/items-profesor/items-profesor.component");
var items_asignatura_component_1 = require("./components/items-asignatura/items-asignatura.component");
var http_1 = require("@angular/common/http");
var ng_multiselect_dropdown_1 = require("ng-multiselect-dropdown");
var drag_drop_1 = require("@angular/cdk/drag-drop");
var horario_dialog_component_1 = require("./components/horario-dialog/horario-dialog.component");
var button_1 = require("@angular/material/button");
var form_field_1 = require("@angular/material/form-field");
var input_1 = require("@angular/material/input");
var select_1 = require("@angular/material/select");
var dialog_1 = require("@angular/material/dialog");
var table_1 = require("@angular/material/table");
var grid_list_1 = require("@angular/material/grid-list");
var tooltip_1 = require("@angular/material/tooltip");
var forms_2 = require("@angular/forms");
var carreras_dialog_component_1 = require("./components/carreras-dialog/carreras-dialog.component");
var items_horario_component_1 = require("./components/items-horario/items-horario.component");
var checkbox_1 = require("@angular/material/checkbox");
var profesores_resumen_component_1 = require("./components/profesores-resumen/profesores-resumen.component");
var divider_1 = require("@angular/material/divider");
var paginator_1 = require("@angular/material/paginator");
var login_component_1 = require("./components/login/login.component");
var card_1 = require("@angular/material/card");
var usuarios_component_1 = require("./components/usuarios/usuarios.component");
var items_usuario_component_1 = require("./components/items-usuario/items-usuario.component");
var usuario_edit_component_1 = require("./components/usuario-edit/usuario-edit.component");
var usuario_nuevo_component_1 = require("./components/usuario-nuevo/usuario-nuevo.component");
var auth_service_1 = require("./components/services/auth.service");
var horario_observacion_dialog_component_1 = require("./components/horario-observacion-dialog/horario-observacion-dialog.component");
var detalles_component_1 = require("./components/detalles/detalles.component");
var detalle_edit_component_1 = require("./components/detalle-edit/detalle-edit.component");
var detalle_nuevo_component_1 = require("./components/detalle-nuevo/detalle-nuevo.component");
var items_detalle_component_1 = require("./components/items-detalle/items-detalle.component");
var detalle_service_1 = require("./components/services/detalle.service");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                home_component_1.HomeComponent,
                header_component_1.HeaderComponent,
                footer_component_1.FooterComponent,
                submenu_component_1.SubmenuComponent,
                especificacion_component_1.EspecificacionComponent,
                horario_component_1.HorarioComponent,
                error_component_1.ErrorComponent,
                horario_nuevo_component_1.HorarioNuevoComponent,
                horario_edit_component_1.HorarioEditComponent,
                asignatura_nuevo_component_1.AsignaturaNuevoComponent,
                asignatura_edit_component_1.AsignaturaEditComponent,
                aula_nuevo_component_1.AulaNuevoComponent,
                aula_edit_component_1.AulaEditComponent,
                profesor_nuevo_component_1.ProfesorNuevoComponent,
                profesor_edit_component_1.ProfesorEditComponent,
                asignaturas_component_1.AsignaturasComponent,
                aulas_component_1.AulasComponent,
                profesores_component_1.ProfesoresComponent,
                sidebar_component_1.SidebarComponent,
                items_aula_component_1.ItemsAulaComponent,
                items_profesor_component_1.ItemsProfesorComponent,
                items_asignatura_component_1.ItemsAsignaturaComponent,
                horario_dialog_component_1.HorarioDialogComponent,
                carreras_dialog_component_1.CarrerasDialogComponent,
                items_horario_component_1.ItemsHorarioComponent,
                profesores_resumen_component_1.ProfesoresResumenComponent,
                login_component_1.LoginComponent,
                usuarios_component_1.UsuariosComponent,
                items_usuario_component_1.ItemsUsuarioComponent,
                usuario_edit_component_1.UsuarioEditComponent,
                usuario_nuevo_component_1.UsuarioNuevoComponent,
                horario_observacion_dialog_component_1.HorarioObservacionDialogComponent,
                detalles_component_1.DetallesComponent,
                detalle_edit_component_1.DetalleEditComponent,
                detalle_nuevo_component_1.DetalleNuevoComponent,
                items_detalle_component_1.ItemsDetalleComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                router_1.RouterModule,
                app_routing_module_1.AppRoutingModule,
                forms_1.FormsModule,
                animations_1.BrowserAnimationsModule,
                http_1.HttpClientModule,
                icon_1.MatIconModule,
                ng_multiselect_dropdown_1.NgMultiSelectDropDownModule,
                drag_drop_1.DragDropModule,
                button_1.MatButtonModule,
                form_field_1.MatFormFieldModule,
                input_1.MatInputModule,
                select_1.MatSelectModule,
                dialog_1.MatDialogModule,
                table_1.MatTableModule,
                grid_list_1.MatGridListModule,
                tooltip_1.MatTooltipModule,
                checkbox_1.MatCheckboxModule,
                divider_1.MatDividerModule,
                paginator_1.MatPaginatorModule,
                card_1.MatCardModule,
                forms_2.ReactiveFormsModule
            ],
            providers: [auth_service_1.AuthService, detalle_service_1.DetalleService],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
