const router = require('express').Router();
const { verifyToken, verifyNutritionistToken } = require('../controllers/verifyToken');
const sequelize = require('../db');
const { Diet, User, Recipe, Review } = sequelize.models;

//CREAR DIETAS
router.post('/:userId', verifyNutritionistToken, async (req, res) => {
  const { title, price, plan } = req.body;
  const owner = req.params.userId;

  if (!title || !price || !owner || !plan) {
    return res.status(400).json({ success: false, message: 'Invalid data format.' });
  }

  let plain = {};

  for (const entry of plan) { // iterar sobre las propiedades del objeto plan
    const day = entry.day;
    const course = entry.meals; // array

    for (const m in course) { // iterar sobre las propiedades del objeto meals (breakfast, lunch, dinner)

      if (!Array.isArray(course[m])) {
        return res.status(400).json({ error: 'Invalid data format.' });
      }

      plain[day] = {}; // valor por defecto
      let meals = {}; // valor por defecto

      for (const dish of course[m]) { // iterar sobre los ids dentro del array breakfast / lunch / dinner
        plain[day][m] = {};
        const meal = await Recipe.findByPk(dish).then(r => r.dataValues).catch(() => null); // asignar las comidas en caso existan
        const title = meal.title.replace(/\s+/g, '_');
        meals[title] = meal;
      }
      plain[day][m] = meals; // meals es ahora un array con las recetas validas
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
    return res.status(500).json({ success: false, message: '1 There was an error processing your request.' });
  }

  if (targetDiet._options.isNewRecord) {
    const assigned = await ownerModel.addDiet(targetDiet).catch(e => console.log(e));

    if (assigned) {
      res.status(200).json({ success: true, message: 'Diet created successfully.' });  
    } else {
      return res.status(500).json({ success: false, message: '2 There was an error processing your request.' });
    }
    
  } else {
    res.status(200).json({ success: false, message: 'Diet already exists.', result: targetDiet.dataValues });
  }

});

//OBTENER DIETA SEGUN ID
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
  const result = await Diet.findAll({
    attributes: ['id', 'price'],
    include: [{
      model: User,
      attributes: ['id', 'is_nutritionist', 'is_personal_trainer', 'profile_img']
    }, {
      model: Review,
      attributes: ['points']
    }]
  }).then(result => result.map(entry => ({
    ...entry.dataValues,
    Reviews: undefined, // ignore unwanted properties
    Users: undefined,   
    owner: { ...entry.dataValues.Users[0].dataValues, User_diets: undefined },  // *assuming Users has a single entry
    reviews: entry.dataValues.Reviews.length,
    rating: entry.dataValues.Reviews.map(e => e.points).reduce((p, c) => p + c, 0) / entry.dataValues.Reviews.length
  })));

  res.status(200).json(result);
});


//EDITAR UNA DIETA
router.put('/update/:userId/:dietId', verifyNutritionistToken, async (req, res) => {
  try {
    const { title, price, plan } = req.body;
    const { userId, dietId } = req.params;
    let updateValues = {};

    //Debe enviarse al menos un dato
    if (!title && !price && !userId && !plan) {
      return res.status(400).json({ success: false, message: 'Invalid data format' });
    }
    if (title) updateValues.title = title;
    //El precio debe ser mayor o igual a 0
    if (price && !isNaN(price * 1) && price >= 0) updateValues.price = price;

    let plain = {};

    //Se arma el plan de la dieta, con sus recetas
    if (plan) {
      for (const entry of plan) {
        const day = entry.day;
        const course = entry.meals;
        for (const m in course) {
          const meal = await Recipe.findByPk(course[m]).then(r => r.dataValues);
          plain[day] = plain[day] || {};
          plain[day][m] = meal;
        }
      }
      updateValues.plain = plain;
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
      let success = await Diet.update({
        [key]: updateValues[key]
      }, {
        where: {
          id: dietId
        }
      });
      if (!success) return res.status(400).json({ success: false, message: "Error updating exercise" });
    }
    let diet = await Diet.findByPk(dietId);
    return res.status(200).send(diet);

  } catch (error) {
    return res.status(400).json({ error: error });
  }
});

module.exports = router;