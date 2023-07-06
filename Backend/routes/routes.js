'use strict'


var express = require('express');
var AsignaturaController = require('../controllers/asignatura')
var AulaController = require('../controllers/aula')
var ProfesorController = require('../controllers/profesor')
var HorarioController = require('../controllers/horario')
var UsuarioController = require('../controllers/usuario')
var DetalleController = require('../controllers/detalle')
var AuthController  = require('../controllers/login');
var BDController  = require('../controllers/baseDeDatos');
const { authenticateToken } = require('../middleware/authMiddleware');
var router = express.Router();


//rutas 


/* Login */

router.post('/verifyCode', AuthController.verifyCode);

router.post('/sendCode', AuthController.sendCode);

/* Asignaturas */
router.post('/save', AsignaturaController.save);
router.post('/save-for-profesor', AsignaturaController.saveForProfesor);
router.get('/asignaturas/:last?', AsignaturaController.getAsignaturas);
router.get('/asignatura/:id', AsignaturaController.getAsignatura);
router.put('/asignatura/:id', AsignaturaController.update);
router.delete('/asignatura/:id', AsignaturaController.delete);
router.get('/search/:search1/:search2', AsignaturaController.search);
router.get('/searchThree/:search1/:search2/:search3', AsignaturaController.searchThree);
router.get('/searchFour/:search1/:search2/:search3/:search4', AsignaturaController.searchFour);
router.get('/searchOne/:search1', AsignaturaController.searchOne);


/* Aulas */

router.post('/save-aula', AulaController.save);
router.get('/aulas/:last?', AulaController.getAulas);
router.get('/aula/:id', AulaController.getAula);
router.put('/aula/:id', AulaController.update);
router.delete('/aula/:id', AulaController.delete);
router.get('/searchAula/:search1', AulaController.search);

/* Profesores */

router.post('/save-profesor', ProfesorController.save);
router.get('/profesores/:last?', ProfesorController.getProfesores);
router.get('/profesor/:id', ProfesorController.getProfesor);
router.put('/profesor/:id', ProfesorController.update);
router.delete('/profesor/:id', ProfesorController.delete);
router.get('/searchProfesor/:search1', ProfesorController.search);

/* Horario */


router.post('/save-horario', HorarioController.save);
router.get('/horarios/:last?', HorarioController.getHorarios);
router.get('/horario/:id', HorarioController.getHorario);
router.put('/horario/:id', HorarioController.update);
router.delete('/horario/:id', HorarioController.delete);
router.get('/searchHorario/:search1', HorarioController.search);

/* Usuario */


router.post('/save-usuario', UsuarioController.save);
router.get('/usuarios/:last?', UsuarioController.getUsuarios);
router.get('/usuario/:id', UsuarioController.getUsuario);
router.put('/usuario/:id', UsuarioController.update);
router.delete('/usuario/:id', UsuarioController.delete);
router.get('/searchUsuario/:search1', UsuarioController.search);

/* Detalles */
router.post('/save-detalle', DetalleController.save);
router.get('/detalles/:last?', DetalleController.getDetalles);
router.get('/detalle/:id', DetalleController.getDetalle);
router.put('/detalle/:id', DetalleController.update);
router.delete('/detalle/:id', DetalleController.delete);

/* Exportar/imporat datos */

router.get('/exportar', BDController.exportar);
router.post('/importar', BDController.importar);



module.exports = router;