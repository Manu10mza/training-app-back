const router = require('express').Router();
const { verifyToken } = require('../controllers/verifyToken');
const CryptoJS = require('crypto-js');
const sequelize = require('../db');
const User = sequelize.models.User;


router.put('/', verifyToken, async (req, res) => {

  const { userId, field, value } = req.body;

  const targetUser = await User.findByPk(userId).then(result => result.dataValues).catch(() => false);

  let newValue = value;

  if (field === 'password') {
    newValue = CryptoJS.AES.encrypt(value, process.env.PASSWORD_KEY).toString();
  }

  if (field === 'email') {
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
      return res.status(400).send({ success: false, message: 'Invalid email format.' });
    }
  }

  if (field === 'profile_img') {
    if (!/https?:\/\/.+\.(a?png|gif|p?jpe?g|jfif|pjp|webp|pdf|svg|avif|jxl|bmp|ico|cur|tiff?)$/i.test(value)) {
      return res.status(400).send({ success: false, message: 'Invalid image link.' });
    }
  }

  if (!targetUser) {
    return res.status(400).send({ success: false, message: 'User ID was not found in the database.' });
  }

  if (!targetUser[field]) {
    return res.status(400).send({ success: false, message: 'Invalid field name.' });
  }

  if (targetUser[field] === newValue) {
    return res.status(400).send({ success: false, message: 'New values must differ from old values.' });
  }

  const success = await User.update({
    [field]: newValue
  }, {
    where: {
      id: userId
    }
  }).then(result => result[0]);

  if (success) {
    res.status(200).send({ success: true, message: 'Successfully updated user information.' });
  } else {
    res.status(500).send({ success: false, message: 'There was an error processing your request.' });
  }

});

module.exports = router;