"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ItemsAsignaturaComponent = void 0;
var sweetalert2_1 = require("sweetalert2");
var core_1 = require("@angular/core");
var asignatura_service_1 = require("../services/asignatura.service");
var table_1 = require("@angular/material/table");
var detalle_service_1 = require("../services/detalle.service");
var ItemsAsignaturaComponent = /** @class */ (function () {
    function ItemsAsignaturaComponent(_asignaturaService, _route, _router, _detalleService) {
        this._asignaturaService = _asignaturaService;
        this._route = _route;
        this._router = _router;
        this._detalleService = _detalleService;
        this.colorCuadro = document.querySelector(".color-square");
        this.terminoBusquedaAsignatura = '';
        this.asignaturasObtenidos = [];
        this.carrerasFiltradas = [];
        this.columnas = ['N°', 'Nombre', 'Carrera', 'Periodo', 'Profesor', 'Horario', 'Creditos', 'Color', 'Acciones'];
        this.url = this._detalleService.Global.url;
        this.is_admin = false;
        this.is_aprobador = false;
        this.authToken = this._detalleService.authToken;
        this.userData = this._detalleService.userData;
    }
    ItemsAsignaturaComponent.prototype.ngOnInit = function () {
        /*  this.getAsignaturas() */
        if (this.userData.rol === "Administrador" || this.userData.rol === "Aprobador") {
            this.is_admin = true;
            this.is_aprobador = true;
        }
        this.getDataDetalles();
    };
    ItemsAsignaturaComponent.prototype.getDataDetalles = function () {
        var _this = this;
        this._detalleService.getRolesIndex().subscribe(function (roles) {
            _this.rolesCarreras = roles;
        });
        this._detalleService.getCarreras().subscribe(function (carreras) {
            _this.carreras = carreras;
            _this._asignaturaService.getAsignaturas().subscribe(function (response) {
                if (response.asignaturas) {
                    _this.asignaturasObtenidos = response.asignaturas;
                    var carreraActual_1 = _this.rolesCarreras[_this.userData.rol.toLowerCase().toLowerCase().replace(/\s/g, "")];
                    _this.carrerasFiltradas = [];
                    if (carreraActual_1) {
                        _this.carrerasFiltradas = _this.asignaturasObtenidos.filter(function (elemento) { return elemento.carrera.includes(carreraActual_1); });
                    }
                    else {
                        _this.carrerasFiltradas = _this.asignaturasObtenidos;
                    }
                    _this.asignaturasFiltrados = new table_1.MatTableDataSource(_this.carrerasFiltradas);
                    _this.asignaturasFiltrados.paginator = _this.paginator;
                }
            }, function (error) {
                console.log(error);
            });
        });
        this._detalleService.getSemestres().subscribe(function (semestres) {
            _this.semestres = semestres;
        });
    };
    /*
      getAsignaturas() {
        this._asignaturaService.getAsignaturas().subscribe(
          response => {
            if (response.asignaturas) {
              this.asignaturasObtenidos = response.asignaturas
              let carreraActual = this.rolesCarreras[this.userData.rol.toLowerCase()];
    
              this.carrerasFiltradas = [];
    
              if (carreraActual) {
                this.carrerasFiltradas = this.asignaturasObtenidos.filter(elemento => elemento.carrera.includes(carreraActual));
              } else {
                this.carrerasFiltradas = this.asignaturasObtenidos;
              }
              
              this.asignaturasFiltrados = new MatTableDataSource<any>(this.carrerasFiltradas);
              this.asignaturasFiltrados.paginator = this.paginator;
            }
          },
          error => {
            console.log(error)
          }
        )
      } */
    ItemsAsignaturaComponent.prototype["delete"] = function (id) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: '¿Estás seguro?',
            text: 'La asignatura se eliminará permanentemente',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete'
        }).then(function (result) {
            if (result.isConfirmed) {
                _this._asignaturaService["delete"](id).subscribe(function (response) {
                    setTimeout(function () {
                        location.reload();
                    }, 1200);
                }, function (error) {
                    console.log(error);
                    _this._router.navigate(['/especificacion/asignaturas']);
                });
                sweetalert2_1["default"].fire('Asignatura borrada', 'La Asignatura ha sido borrado', 'success');
            }
            else {
                sweetalert2_1["default"].fire('Operación cancelada', 'La Asignatura no ha sido borrado', 'warning');
            }
        });
    };
    ItemsAsignaturaComponent.prototype.filtrarAsignaturas = function () {
        var _this = this;
        var terminosBusqueda = this.terminoBusquedaAsignatura.trim().toLowerCase();
        var asignaturasFiltrados = this.carrerasFiltradas;
        if (this.selectedCarrera !== undefined) {
            asignaturasFiltrados = asignaturasFiltrados.filter(function (asignatura) {
                return asignatura.carrera.some(function (carrera) { return carrera.toLowerCase() === _this.selectedCarrera.toLowerCase(); });
            });
        }
        if (this.selectedSemestre !== undefined) {
            asignaturasFiltrados = asignaturasFiltrados.filter(function (asignatura) {
                return asignatura.semestre.some(function (semestre) { return semestre.toLowerCase() === _this.selectedSemestre.toLowerCase(); });
            });
        }
        if (this.selectedCarrera === "Todas" || this.selectedSemestre === "Todas") {
            asignaturasFiltrados = this.carrerasFiltradas;
        }
        if (terminosBusqueda !== '') {
            var regexBusqueda_1 = new RegExp("\\b" + terminosBusqueda + "\\b", 'gi');
            asignaturasFiltrados = asignaturasFiltrados.filter(function (asignaturas) {
                return asignaturas.nombre.toString().toLowerCase().match(regexBusqueda_1) ||
                    asignaturas.profesor[0].nombre.toString().toLowerCase().match(regexBusqueda_1) ||
                    asignaturas.creditos.toString().toLowerCase().match(regexBusqueda_1) ||
                    asignaturas.abreviatura.toString().toLowerCase().match(regexBusqueda_1) ||
                    asignaturas.color.toString().toLowerCase().match(regexBusqueda_1);
            });
            if (asignaturasFiltrados.length === 0) {
                var terminosBusquedaSeparados = terminosBusqueda.split(' ');
                regexBusqueda_1 = new RegExp("(" + terminosBusquedaSeparados.join('|') + ")", 'gi');
                asignaturasFiltrados = this.carrerasFiltradas.filter(function (asignaturas) {
                    return asignaturas.nombre.toString().toLowerCase().match(regexBusqueda_1) ||
                        asignaturas.profesor[0].nombre.toString().toLowerCase().match(regexBusqueda_1) ||
                        asignaturas.creditos.toString().toLowerCase().match(regexBusqueda_1) ||
                        asignaturas.abreviatura.toString().toLowerCase().match(regexBusqueda_1) ||
                        asignaturas.color.toString().toLowerCase().match(regexBusqueda_1);
                });
            }
        }
        this.asignaturasFiltrados = new table_1.MatTableDataSource(asignaturasFiltrados);
    };
    ItemsAsignaturaComponent.prototype.allAsignaturas = function () {
        this._router.navigate(['/especificacion/asignaturas']);
        location.reload();
    };
    ItemsAsignaturaComponent.prototype.redirectEdit = function (id) {
        this._router.navigate(['/especificacion/asignaturas/editarAsignatura/', id]);
    };
    __decorate([
        core_1.Input()
    ], ItemsAsignaturaComponent.prototype, "asignaturas");
    __decorate([
        core_1.ViewChild('paginatorAs', { static: false })
    ], ItemsAsignaturaComponent.prototype, "paginator");
    ItemsAsignaturaComponent = __decorate([
        core_1.Component({
            selector: 'app-items-asignatura',
            templateUrl: './items-asignatura.component.html',
            styleUrls: ['./items-asignatura.component.css'],
            providers: [asignatura_service_1.AsignaturaService, detalle_service_1.DetalleService]
        })
    ], ItemsAsignaturaComponent);
    return ItemsAsignaturaComponent;
}());
exports.ItemsAsignaturaComponent = ItemsAsignaturaComponent;
