const express = require('express');
const router = express.Router();

//Enlazamos las rutas
const registerRoute = require('./Register');
const logInRoute = require('./User');
const routineRoute = require('./Routine');
const exerciseRoute = require('./Exercise');
const recipeRoute = require('./Recipe');
const transactionRoute = require('./Transaction');
const dietRoutes = require('./Diet');
const reviewRoutes = require('./Review');
const stripeRoutes = require('./stripe');
const generalRoutes = require('./General');

router.use('/register', registerRoute);
router.use('/user', logInRoute);
router.use('/exercise', exerciseRoute);
router.use('/recipe', recipeRoute);
router.use('/diet', dietRoutes);
router.use('/routine', routineRoute);
router.use('/transaction', transactionRoute);
router.use('/review', reviewRoutes);
router.use('/checkout', stripeRoutes);
router.use('/general', generalRoutes);

module.exports = router;