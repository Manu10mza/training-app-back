const express = require('express');
const router = express.Router();

//Enlazamos las rutas
const registerRoute = require('./Register');
const logInRoute = require('./User');
const getRecipe = require('./getRecipe');
const getRecipes = require('./getRecipes');
const postRecipe = require('./Recipe');

router.use('/register', registerRoute);
router.use('/user', logInRoute);
router.use('/recipe', getRecipe);
router.use('/recipe', postRecipe);
router.use('/recipes', getRecipes);


module.exports = router;