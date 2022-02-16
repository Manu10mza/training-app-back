const router = require('express').Router();
const sequelize = require('../db');
const Recipe = sequelize.models.Recipe;

router.get('/', async (req, res) => {

  const recipes = await Recipe.findAll().catch(e => console.log(e));

  if (recipes) {
    res.status(200).json(recipes);
  } else {
    res.status(500).json({ message: 'There was an error processing your request.' });
  }

});


module.exports = router;