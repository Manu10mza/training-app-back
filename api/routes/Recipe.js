const router = require('express').Router();
const sequelize = require('../db');
const Recipe = sequelize.models.Recipe;
const User = sequelize.models.User;

//CREAR UNA RECETA
router.post('/', async (req, res) => {
  //Buscamos el usuario que está por crear la receta
  const user = await User.findOne({
    where:{
      id : req.body.userId
    }
  });
  //Nos aseguramos que este exista
  if(!user){
    return res.status(400).json({error:'User not found'});
  };

  //Se necesita haber proporcionado al menos el titulo
  if (!req.body.recipe.title) {
    return res.status(400).json({ error: 'You must provide a title.' });
  };
  //Nos aseguramos de que no existe algo con el mismo titulo
  const findRecipe = await Recipe.findOne({
    where:{
      title : req.body.recipe.title
    }
  })

  if(!findRecipe){
    try {
      const recipe = await Recipe.create(req.body.recipe);
      //Vinculamos el usuario con la receta
      await user.addRecipe(recipe);
      return res.status(200).json({success: 'Recipe created successfully'})
  
    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }
    
  } else{
    return res.status(401).json({error: 'There is already a recipe with that title'})
  }
});

//TRAER TODAS LAS RECETAS DE PERTENECIENTE A UN USUARIO
router.get('/', async (req, res) => {
  //Traemos todas las recetas que contenga un usuario
  const user = await User.findOne({
    where:{
      id : req.body.userId
    },
    include : Recipe
  });

  if(user){
    //Separamos los datos de las recetas del resto de datos del usuario
    const recipes = user.dataValues.Recipes.map( item => item.dataValues );
    return res.status(200).json(recipes);
  }
  res.status(400).json({error: 'User not found'});
});

//TRAER SOLO UNA DIETA ESPECIFICA
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const foundRecipe = await Recipe.findOne({
    where: {
      id
    }
  });

  if (foundRecipe) {
    res.status(200).json(foundRecipe);
  } else {
    res.status(404).json({ error: 'Invalid id.' });
  }
});


module.exports = router;