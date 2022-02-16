const router = require('express').Router();
const sequelize = require('../db');
const Recipe = sequelize.models.Recipe;

router.post('/', async (req, res) => {
  /*
    title: string
    kcal: number(float)
    carbohydrates: number(float)
    grease: number(float)
    proteins: number(float)
    grs: number(float)
    description: string
  */
  const { title, kcal, carbohydrates, grease, proteins, grs, description } = req.body;

  if (!title) {
    return res.status(304).json({ message: 'You must provide a title.' });
  }

  const newRecipe = await Recipe.findOrCreate({
    where: {
      title,
      kcal,
      carbohydrates, 
      grease, 
      proteins, 
      grs, 
      description
    }
  }).then(res => ({ result: res[0].dataValues, new: res[0]._options.isNewRecord }))
    .catch(err => {

      console.log(err);

      return {
        error: 'There was an error processing your request.'
      };
    });

  if (newRecipe.error) {
    return res.status(500).json(newRecipe);
  }

  if (newRecipe.new) {
    res.status(200).json({ message: 'Successfully created a new recipe.' });
  } else {
    res.status(304).json({ message: 'Recipe already exists.', result: newRecipe.result });
  }

});


module.exports = router;