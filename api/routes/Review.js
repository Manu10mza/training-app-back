const router = require('express').Router();
const { verifyToken } = require('../controllers/verifyToken');
const sequelize = require('../db');
const { User, Review } = sequelize.models;


router.post('/', verifyToken, async (req, res) => {

  const { senderId, productId, points, comments } = req.body;

  const sender = await User.findByPk(senderId).catch(() => false);

  if (!sender) {
    return res.status(400).send({ error: 'Missing or invalid sender ID.' });
  }

  if (!productId || !/^[0-9a-fA-F]{8}\b-([0-9a-fA-F]{4}-){3}\b[0-9a-fA-F]{12}$/.test(productId)) {
    return res.status(400).send({ error: 'Missing or invalid product ID.' });
  }

  const userTransactions = await sender.getTransactions();

  const acquired = userTransactions.find(transaction => transaction.product.id === productId);

  if (!acquired) {
    return res.status(400).send({ error: 'User cannot review this product.' });
  } else {
    await Review.create({
      userId: senderId,
      productId,
      points,
      comments
    });
  }

  res.status(200).send({ success: 'Successfully added a review.', result: userReview.id });

});

module.exports = router;