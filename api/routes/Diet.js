const router = require('express').Router();
const { verifyToken, verifyNutritionistToken } = require('../controllers/verifyToken');
const sequelize = require('../db');
const { Diet, User, Recipe } = sequelize.models;

router.post('/',async (req, res) => {
  const { title, price, owner, plan } = req.body;
  if (!title || !price || !owner || !plan) {
    return res.status(400).json({ success: false, message: 'Invalid data format' });
  }

  let plain = {};

  for (const entry of plan) {
    const day = entry.day;
    const course = entry.meals;
    for (const m in course) {
      const meal = await Recipe.findByPk(course[m]).then(r => r.dataValues);
      plain[day] = plain[day] || {};
      plain[day][m] = meal;
    }
  }

  const ownerModel = await User.findOne({
    where: {
      id: owner
    }
  });

  if (!ownerModel) {
    return res.status(400).json({ success: false, message: 'Invalid owner ID.' });
  }

  const targetDiet = await Diet.findOrCreate({
    where: {
      title,
      price,
      owner,
      plain
    }
  }).then(res => res[0]).catch(e => console.log(e));

  if (!targetDiet) {
    return res.status(500).json({ success: false, message: 'There was an error processing your request.' });
  }
  if (targetDiet._options.isNewRecord) {
    const assigned = await ownerModel.addDiet(targetDiet).catch(e => console.log(e));

    if (assigned) {
      res.status(200).json({ success: true, message: 'Diet created successfully.' });  
    } else {
      return res.status(500).json({ success: false, message: 'There was an error processing your request.' });
    }
    
  } else {
    res.status(200).json({ success: false, message: 'Diet already exists.', result: targetDiet.dataValues });
  }

});


router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: 'You must provide a user ID.' });
  }

  const target = await User.findOne({
    where: {
      id
    }
  }).catch(() => false);

  if (!target) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const targetDiets = await target.getDiets();

  const response = targetDiets.map(diet => {
    return {
      diet_id: diet.id,
      owner_id: diet.owner,
      price: diet.price,
      title: diet.title,
      plain: diet.plain
    };
  });

  if (targetDiets) {
    res.status(200).json({ success: true, result: response });
  } else {
    res.status(404).json({ success: false, message: 'User has not created any diets.' });
  }
});

//TRAER TODAS LAS DIETAS DE LA DB
router.get('/', async (req, res) => {
  const result = await Diet.findAll();
  res.status(200).json(result);
});

//EDITAR UNA DIETA
router.put('/update/:userId/:dietId', async (req, res) => {
  try{
    const { title, price, plan } = req.body;
    const {userId,dietId} = req.params;
    let updateValues={};

  //Debe enviarse al menos un dato
  if (!title && !price && !userId && !plan) {
    return res.status(400).json({ success: false, message: 'Invalid data format' });
  }
  if(title) updateValues.title=title;
  //El precio debe ser mayor o igual a 0
  if (price && !isNaN(price * 1) && price >= 0) updateValues.price = price;

  let plain = {};

  //Se arma el plan de la dieta, con sus recetas
  if(plan){
    for (const entry of plan) {
      const day = entry.day;
      const course = entry.meals;
      for (const m in course) {
        const meal = await Recipe.findByPk(course[m]).then(r => r.dataValues);
        plain[day] = plain[day] || {};
        plain[day][m] = meal;
      }
    }
    updateValues.plain=plain;
  }
  const ownerModel = await User.findOne({
    where: {
      id: userId
    }
  });

  //Se verifica si el usuario existe
  if (!ownerModel) {
    return res.status(400).json({ success: false, message: 'Invalid owner ID.' });
  }

  //Actualización de datos
  for (const key in updateValues) {
      let success=await Diet.update({
          [key]: updateValues[key]
      }, {
              where: {
                  id: dietId
              }
      })
      if(!success) throw new Error("Error updating exercise")
  }
  let diet=await Diet.findByPk(dietId);
  return res.status(200).send(diet);

} catch(error) {
    return res.status(400).json({error:error.message});
}
});

module.exports = router;