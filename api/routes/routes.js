const express = require('express');
const router = express.Router();

//Enlazamos las rutas
const registerRoute = require('./Register');
const logInRoute = require('./User');
const rutineRoute = require('./Rutine');
const exerciseRoute = require('./Exercise');
const recipeRoute = require('./Recipe');
const transactionRoute = require('./Transaction');
const dietRoutes = require('./Diet');

router.use('/register', registerRoute);
router.use('/user', logInRoute);
router.use('/exercise', exerciseRoute);
router.use('/recipe', recipeRoute);
router.use('/diet', dietRoutes);
router.use('/rutine', rutineRoute);
router.use('/transaction', transactionRoute);

module.exports = router;