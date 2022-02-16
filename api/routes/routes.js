const express = require('express');
const router = express.Router();

//Enlazamos las rutas
const registerRoute = require('./Register');
const logInRoute = require('./User');
const rutineRout=require('./Rutine');
const exerciseRout=require('./Rutine');
const getRecipe = require('./getRecipe');
const getRecipes = require('./getRecipes');
const postRecipe = require('./Recipe');

router.use('/rutine', rutineRout);
router.use('/exercise', exerciseRout);
router.use('/register', registerRoute);
router.use('/user', logInRoute);
router.use('/recipe', getRecipe);
router.use('/recipe', postRecipe);
router.use('/recipes', getRecipes);

module.exports = router;