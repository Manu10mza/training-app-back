const router = require('express').Router();
const { verifyToken } = require('../controllers/verifyToken');
const sequelize = require('../db');
const { User, Review, Diet, Routine } = sequelize.models;


router.post('/', verifyToken, async (req, res) => {

  const { senderId, productId, points, comments } = req.body;

  const sender = await User.findByPk(senderId).catch(() => false);

  if (!sender) {
    return res.status(400).send({ error: 'Missing or invalid sender ID.' });
  }

  if (!productId || !/^[0-9a-fA-F]{8}\b-([0-9a-fA-F]{4}-){3}\b[0-9a-fA-F]{12}$/.test(productId)) {
    return res.status(400).send({ error: 'Missing or invalid product ID.' });
  }

  if (!points) {
    return res.status(400).send({ error: 'You must include a punctuation.' });
  }

  const product = await Diet.findByPk(productId).catch(() => false) || await Routine.findByPk(productId).catch(() => false);

  if (!product) {
    return res.status(404).send({ error: 'Product does not exist.' });
  }

  const userTransactions = await sender.getTransactions();
  const acquired = userTransactions.find(transaction => transaction.product.id === productId);

  if (!acquired) {
    return res.status(400).send({ error: 'User cannot review this product.' });
  }

  const newReview = await Review.create({
    userId: senderId,
    productId,
    points,
    comments
  });

  const review = await product.addReview(newReview).catch(e => { console.log(e); return false; });

  if (review) {
    res.status(200).send({ success: 'Successfully added a review.', result: newReview.id });
  } else {
    res.status(503).send({ error: 'There was a problem processing your request.' });
  }

});

module.exports = router;