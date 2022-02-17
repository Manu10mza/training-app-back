const router = require('express').Router();
const { verifyToken, verifyNutritionistToken } = require('../controllers/verifyToken');
const sequelize = require('../db');
const Diet = sequelize.models.Diet;
const User = sequelize.models.User;
const Recipe = sequelize.models.Recipe;

router.post('/', verifyNutritionistToken, async (req, res) => {

  const { title, price, owner, plan } = req.body;

  if (!title || !price || !owner || !plan) {
    return res.status(400).json({ success: false, message: 'Invalid data format' });
  }

  let plain = {};

  for (const entry of plan) {
    const day = entry.day;
    const course = entry.plan;
    for (const m in course) {
      const meal = await Recipe.findByPk(course[m]).then(r => r.dataValues);
      plain[day] = meal;
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


module.exports = router;