const router = require('express').Router();
const sequelize = require('../db');
const Recipe = sequelize.models.Recipe;

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