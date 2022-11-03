/* 
    Rutas de Usuarios / Auth
    host + /api/auth

*/

const { Router } = require('express');
const { check } = require('express-validator');
const { fieldsValidators } = require('../middlewares/fields-validators');
const { createUser, loginUser, reToken } = require('../controllers/auth');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();



router.post(
    '/new',
    [ //middlewares
        check('name', 'The name is required ').not().isEmpty(),
        check('email', 'The email is required ').isEmail(),
        check('password', 'The password must have more than 6 characters').isLength({ min: 6 }),
        fieldsValidators
    ],
    createUser

);

router.post(
    '/',
    [ //middlewares
        check('email', 'The email is required ').isEmail(),
        check('password', 'The password must have more than 6 characters').isLength({ min: 6 }),
        fieldsValidators
    ],
    loginUser
);

router.get('/renew', validateJWT, reToken);


module.exports = router;