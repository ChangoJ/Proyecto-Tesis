"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppRoutingModule = void 0;
var profesores_resumen_component_1 = require("./components/profesores-resumen/profesores-resumen.component");
var profesor_edit_component_1 = require("./components/profesor-edit/profesor-edit.component");
var profesor_nuevo_component_1 = require("./components/profesor-nuevo/profesor-nuevo.component");
var aula_nuevo_component_1 = require("./components/aula-nuevo/aula-nuevo.component");
var aula_edit_component_1 = require("./components/aula-edit/aula-edit.component");
var asignatura_nuevo_component_1 = require("./components/asignatura-nuevo/asignatura-nuevo.component");
var asignatura_edit_component_1 = require("./components/asignatura-edit/asignatura-edit.component");
var profesores_component_1 = require("./components/profesores/profesores.component");
var aulas_component_1 = require("./components/aulas/aulas.component");
var error_component_1 = require("./components/error/error.component");
var asignaturas_component_1 = require("./components/asignaturas/asignaturas.component");
var especificacion_component_1 = require("./components/especificacion/especificacion.component");
var horario_component_1 = require("./components/horario/horario.component");
var home_component_1 = require("./components/home/home.component");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var items_horario_component_1 = require("./components/items-horario/items-horario.component");
var login_component_1 = require("./components/login/login.component");
var usuarios_component_1 = require("./components/usuarios/usuarios.component");
var usuario_edit_component_1 = require("./components/usuario-edit/usuario-edit.component");
var usuario_nuevo_component_1 = require("./components/usuario-nuevo/usuario-nuevo.component");
var auth_guard_1 = require("./components/services/auth.guard");
var login_guard_1 = require("./components/services/login.guard");
var admin_guard_1 = require("./components/services/admin.guard");
var detalle_nuevo_component_1 = require("./components/detalle-nuevo/detalle-nuevo.component");
var detalle_edit_component_1 = require("./components/detalle-edit/detalle-edit.component");
var detalles_component_1 = require("./components/detalles/detalles.component");
var suAdmin_guard_1 = require("./components/services/suAdmin.guard");
var routes = [
    {
        path: 'login', component: login_component_1.LoginComponent, canActivate: [login_guard_1.LoginGuard]
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: 'home', component: home_component_1.HomeComponent, canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'horarios', component: items_horario_component_1.ItemsHorarioComponent, canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'home/creacion/:opcion1/:opcion2/:opcion3/:opcion4',
        component: home_component_1.HomeComponent, canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'home/creacion/:opcion1/:opcion2/:opcion3',
        component: home_component_1.HomeComponent, canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'home/creacion/:opcion1/:opcion2/:opcion3/:opcion4/:opcion5',
        component: home_component_1.HomeComponent, canActivate: [auth_guard_1.AuthGuard]
    },
    {
        path: 'especificacion', component: especificacion_component_1.EspecificacionComponent, canActivate: [auth_guard_1.AuthGuard],
        children: [
            {
                path: 'asignaturas',
                component: asignaturas_component_1.AsignaturasComponent, canActivate: [auth_guard_1.AuthGuard]
            },
            {
                path: 'asignaturas/search/:search1/:search2',
                component: asignaturas_component_1.AsignaturasComponent, canActivate: [auth_guard_1.AuthGuard]
            },
            {
                path: 'asignaturas/search/:search',
                component: asignaturas_component_1.AsignaturasComponent, canActivate: [auth_guard_1.AuthGuard]
            },
            {
                path: 'asignaturas/crearAsignatura',
                component: asignatura_nuevo_component_1.AsignaturaNuevoComponent, canActivate: [auth_guard_1.AuthGuard]
            },
            {
                path: 'asignaturas/editarAsignatura/:id',
                component: asignatura_edit_component_1.AsignaturaEditComponent, canActivate: [auth_guard_1.AuthGuard]
            },
            {
                path: 'aulas',
                component: aulas_component_1.AulasComponent, canActivate: [auth_guard_1.AuthGuard]
            },
            {
                path: 'aulas/searchAula/:search1',
                component: aulas_component_1.AulasComponent, canActivate: [auth_guard_1.AuthGuard]
            },
            {
                path: 'aulas/crearAula',
                component: aula_nuevo_component_1.AulaNuevoComponent, canActivate: [auth_guard_1.AuthGuard]
            },
            {
                path: 'aulas/editarAula/:id',
                component: aula_edit_component_1.AulaEditComponent, canActivate: [auth_guard_1.AuthGuard]
            },
            {
                path: 'profesores',
                component: profesores_component_1.ProfesoresComponent, canActivate: [auth_guard_1.AuthGuard]
            },
            {
                path: 'profesores/resumen-profesores',
                component: profesores_resumen_component_1.ProfesoresResumenComponent, canActivate: [auth_guard_1.AuthGuard]
            },
            {
                path: 'profesores/searchProfesor/:search1',
                component: profesores_component_1.ProfesoresComponent, canActivate: [auth_guard_1.AuthGuard]
            },
            {
                path: 'profesores/editarProfesor/:id',
                component: profesor_edit_component_1.ProfesorEditComponent, canActivate: [auth_guard_1.AuthGuard]
            },
            {
                path: 'profesores/crearProfesor',
                component: profesor_nuevo_component_1.ProfesorNuevoComponent, canActivate: [auth_guard_1.AuthGuard]
            },
            {
                path: 'usuarios',
                component: usuarios_component_1.UsuariosComponent, canActivate: [admin_guard_1.AdminGuard]
            },
            {
                path: 'usuarios/editarUsuario/:id',
                component: usuario_edit_component_1.UsuarioEditComponent, canActivate: [admin_guard_1.AdminGuard]
            },
            {
                path: 'usuarios/crearUsuario',
                component: usuario_nuevo_component_1.UsuarioNuevoComponent, canActivate: [admin_guard_1.AdminGuard]
            },
            {
                path: 'detalles',
                component: detalles_component_1.DetallesComponent, canActivate: [suAdmin_guard_1.suAdminGuard]
            },
            {
                path: 'detalles/editarDetalle/:id',
                component: detalle_edit_component_1.DetalleEditComponent, canActivate: [suAdmin_guard_1.suAdminGuard]
            },
            {
                path: 'detalles/crearDetalle',
                component: detalle_nuevo_component_1.DetalleNuevoComponent, canActivate: [suAdmin_guard_1.suAdminGuard]
            }
        ]
    },
    { path: 'horarios/editarHorario/:id', component: horario_component_1.HorarioComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: '**', component: error_component_1.ErrorComponent, canActivate: [auth_guard_1.AuthGuard] }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forRoot(routes)],
            exports: [router_1.RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
