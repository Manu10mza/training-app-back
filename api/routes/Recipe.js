const router = require('express').Router();
const sequelize = require('../db');
const { verifyToken, verifyNutritionistToken } = require('../controllers/verifyToken');
const Recipe = sequelize.models.Recipe;
const User = sequelize.models.User;

//CREAR UNA RECETA
router.post('/:userId', verifyNutritionistToken, async (req, res) => {
  //Buscamos el usuario que está por crear la receta
  const user = await User.findOne({
    where:{
      id : req.params.userId
    }
  });
  //Nos aseguramos que este exista
  if(!user){
    return res.status(400).json({error:'User not found'});
  };

  //Se necesita haber proporcionado al menos el titulo
  if (!req.body.title) {
    return res.status(400).json({ error: 'You must provide a title.' });
  };
  //Nos aseguramos de que no existe algo con el mismo titulo
  const findRecipe = await Recipe.findOne({
    where:{
      title : req.body.title
    }
  })

  if(!findRecipe){
    try {
      const recipe = await Recipe.create(req.body);
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
router.get('/user/:userId', verifyToken, async (req, res) => {
  //Traemos todas las recetas que contenga un usuario
  const user = await User.findOne({
    where:{
      id : req.params.userId
    },
    include : Recipe
  });

  if(user){
    return res.status(200).json(user.dataValues.Recipes);
  }
  res.status(400).json({error: 'User not found'});
});

//TRAER SOLO UNA DIETA ESPECIFICA
router.get('/:id',verifyToken, async (req, res) => {
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


//MODIFICAR UNA RECETA
router.put('/:recipeId/:userId', verifyNutritionistToken, async (req, res)=>{
  const {recipeId, userId} = req.params;
  const {field, newValue} = req.body;
  //Buscamos la receta
  const targetRecipe = await Recipe.findOne({
    where:{
      id : recipeId
    }
  });

  //Evaluamos posibles conflictos
  if(!newValue){
    return res.status(400).json({error: 'The new value was not provided'})
  }
  if(targetRecipe.dataValues.UserId !== userId){
    return res.status(401).json({error: 'The recipe is not owned by the user'});
  }
  if(!targetRecipe[field]){
    return res.status(400).json({error: 'Invalid field name'});
  }
  if(field === 'description' || field === 'title' ){
    if(typeof newValue !== 'string') return res.status(400).json({error: 'the new value should be of type string'});

  } else {
    if(typeof newValue !== 'number') return res.status(400).json({error: 'the new value should be of type number'});
  }

  //Actualizamos la receta
  const success = Recipe.update({
    [field] : newValue},{
    where:{
      id : recipeId
    }
  });

  if(success) return res.status(200).json({success: 'Updated recipe'})
  return res.status(500).json({error: 'Something went wrong'})
})
module.exports = router;