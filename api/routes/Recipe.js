const router = require('express').Router();
const sequelize = require('../db');
const Recipe = sequelize.models.Recipe;

router.post('/', async (req, res) => {
  const { title, kcal, carbohydrates, grease, proteins, grs, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'You must provide a title.' });
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


router.get('/', async (req, res) => {
  const recipes = await Recipe.findAll().catch(e => console.log(e));

  if (recipes) {
    res.status(200).json(recipes);
    
  } else {
    res.status(500).json({ message: 'There was an error processing your request.' });
  }
});


router.get('/:id', async (req, res) => {
  /*
    id: string
  */
  const { id } = req.params;

  const found = await Recipe.findOne({
    where: {
      id
    }
  }).catch(e => console.log(e));

  if (found) {
    res.status(200).json(found);
  } else {
    res.status(404).json({ error: 'Invalid id.' });
  }
});


module.exports = router;