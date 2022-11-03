/* 
Event Routes
host + /api/events

*/

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { check } = require('express-validator');
const { fieldsValidators } = require('../middlewares/fields-validators');
const { isDate } = require('../helpers/isDate');


const router = Router();
//Todas tienen que  pasar por la validacion del JWT
router.use(validateJWT);


//Obtener evento
router.get('/', getEvents);


//Crear Evento
router.post(
    '/',
    [
        check('title', 'Title is necessary').not().isEmpty(),
        check('start', 'Date start is necessary').custom(isDate),
        check('end', 'Date end is necessary').custom(isDate),
        fieldsValidators
    ],
    createEvent
);


//Actualizar Evento
router.put('/:id',
    [
        check('title', 'Title is necessary').not().isEmpty(),
        check('start', 'Date start is necessary').custom(isDate),
        check('end', 'Date end is necessary').custom(isDate),
        fieldsValidators
    ],
    updateEvent);


// Eliminar Evento
router.delete('/:id', deleteEvent);




module.exports = router;