const express = require('express');
const router = express.Router()

//Enlazamos las rutas
const registerRoute = require('./Register');
const logInRoute = require('./User');
const rutineRout=require('./Rutine');
const exerciseRout=require('./Rutine');

router.use('/register', registerRoute);
router.use('/user', logInRoute);
router.use('/rutine', rutineRout);
router.use('/exercise', exerciseRout);

module.exports = router