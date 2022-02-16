const express = require('express');
const router = express.Router();

//Enlazamos las rutas
const registerRoute = require('./Register');
const logInRoute = require('./User');
const rutineRoute = require('./Rutine');
const exerciseRoute = require('./Rutine');
const recipeRoute = require('./Recipe');

router.use('/rutine', rutineRoute);
router.use('/exercise', exerciseRoute);
router.use('/register', registerRoute);
router.use('/user', logInRoute);
router.use('/recipe', recipeRoute);

module.exports = router;