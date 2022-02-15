const express = require('express');
const router = express.Router()

//Enlazamos las rutas
const registerRoute = require('./Register');
const logInRoute = require('./LogIn');

router.use('/register', registerRoute);
router.use('/user', logInRoute);


module.exports = router