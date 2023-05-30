'use strict'

var express = require('express');
var AsignaturaController = require('../controllers/asignatura')
var AulaController = require('../controllers/aula')
var ProfesorController = require('../controllers/profesor')
var HorarioController = require('../controllers/horario')
var UsuarioController = require('../controllers/usuario')
var router = express.Router();


//rutas 

/* Asignaturas */
router.post('/save', AsignaturaController.save);
router.post('/save-for-profesor', AsignaturaController.saveForProfesor);
router.get('/asignaturas/:last?', AsignaturaController.getAsignaturas);
router.get('/asignatura/:id', AsignaturaController.getAsignatura);
router.put('/asignatura/:id', AsignaturaController.update);
router.delete('/asignatura/:id', AsignaturaController.delete);
router.get('/search/:search1/:search2', AsignaturaController.search);
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


module.exports = router;