const { decrypt, encrypt } = require('../controllers/encrypt');
const router = require('express').Router();
const jwt = require('jsonwebtoken'); //REQUIRE JSON WEB TOKEN PARA CREAR TOKEN DE AUTHORIZACION
const sequelize = require('../db'); //LA BASE DE DATOS
const { User, Recipe, Diet, Exercise, Routine } = sequelize.models; //EL MODELO USER
const { verifyToken } = require('../controllers/verifyToken');

//LOGEO
router.post('/login', async (req, res) => {
      //Para loguearse deben enviar Username o Mail
      console.log(req.body)
      let result;
      if (req.body.username) {
            result = await User.findOne({
                  where: {
                        username: req.body.username
                  }
            });
      } else if (req.body.email) {
            result = await User.findOne({
                  where: {
                        email: req.body.email
                  }
            });
      } else {
            return res.status(400).json({ error: "The necessary data to enter was not sent" });
      }
      //De está manera accedemos a los valores 
      const userDb = result?.dataValues;
      if (userDb) {
            //Desencriptamos la contraseña
            const userPassword = decrypt(userDb.password);
            //Verificamos que sean las contraseñas iguales
            if (userPassword === req.body.password) {
                  userDb.password = userPassword;
                  
                  //Evaluamos su rol
                  let role;
                  if (userDb.is_nutritionist) {
                        if (userDb.is_personal_trainer) {
                              role = 'Nutritionist PTrainer';
                        } else {
                              role = 'Nutritionist';
                        };
                  } else if (userDb.is_personal_trainer) {
                        role = 'PTrainer';
                  } else if (userDb.is_admin) {
                        role = 'Admin';
                  } else {
                        role = 'Client';
                  }
                  
                  //Creamos el token de acceso
                  const accessToken = jwt.sign({
                        userId: userDb.id,
                        role
                  }, process.env.JWT_KEY, { expiresIn: 60 * 60 * 24 });

                  return res.status(200).json({ userId: userDb.id, 
                                                username: userDb.username, 
                                                email: userDb.email, 
                                                profileImg: userDb.profile_img, 
                                                PTrainer:userDb.is_personal_trainer, 
                                                Nutritionist:userDb.is_nutritionist,
                                                accessToken 
                                          });
            }
            return res.status(400).json({ error: "Invalid password" });
      }
      return res.status(400).json({ error: "Invalid email" });
});

/*
      Todo: Crear ruta de eliminacion de usuario
*/

//OBTENER TODOS LOS DATOS DE UN USUARIO
router.get('/:userId', verifyToken, async (req, res) => {
      const result = await User.findOne({ // findByPK
            attributes: ['id', 'username', 'email', 'profile_img', 'gender', 'country', 'training_days', 'height', 'weight', 'createdAt', 'is_nutritionist', 'is_personal_trainer'],
            where: {
                  id: req.params.userId
            }
      });
      if (result) return res.status(200).json(result);
      return res.status(400).json({ error: 'User not found' });
});


//MODIFICAR DATOS DEL USUARIO
router.put('/update/:userId', verifyToken, async (req, res) => {
      /* 
            ! En este caso se pretende que envien un solo campo por peticion, para agilizar las cosas deberia tener la capacidad de procesar más de una propiedad en una sola petición
      */
      const { userId } = req.params;
      const { field, value } = req.body;
      const targetUser = await User.findByPk(userId).then(result => result.dataValues).catch(() => false);
      let newValue = value;
      
      if (!targetUser) {
            return res.status(400).send({ error: 'User ID was not found in the database.' });
      }
      if (!targetUser[field]) {
            return res.status(400).send({ error: 'Invalid field name.' });
      }
      //Evaluamos que lo que nos envían corresponda con lo que se debe guardar
      if (field === 'password') {
            newValue = encrypt(value);
      
      } else if (field === 'email') {
            if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
                  return res.status(400).send({ error: 'Invalid email format.' });
            }
      
      } else if (field === 'profile_img') {
            if (!/https?:\/\/.+\.(a?png|gif|p?jpe?g|jfif|pjp|webp|pdf|svg|avif|jxl|bmp|ico|cur|tiff?)$/i.test(value)) {
                  return res.status(400).send({ error: 'Invalid image link.' });
            }
      }
      
      if (targetUser[field] === newValue) {
            return res.status(400).send({ error: 'New values must differ from old values.' });
      }
      
      const success = await User.update({
            [field]: newValue
      }, {
            where: {
                  id: userId
            }
      }).then(result => result[0]);
      
      if (success) {
            res.status(200).send({ success: 'Successfully updated user information.' });
      } else {
            res.status(500).send({ error: 'There was an error processing your request.' });
      }
});


//TRAE TODOS LOS NUTRISIONISTAS
router.get('/nutritionists', verifyToken, async (req, res) => {
      const nutritionists = await User.findAll({
            attributes: ['id', 'profile_img','username', 'email'],
            where: {
                  is_nutritionist:true
            }
      });
      return res.status(200).send(nutritionists);
});


//TRAE TODOS LOS TRAINERS
router.get('/get/trainers', verifyToken, async (req, res) => {
      const trainers = await User.findAll({
            attributes: ['id', 'profile_img','username', 'email'],
            where: {
                  is_personal_trainer:true
            }
      });
      return res.status(200).send(trainers);
});


router.get('/exists/:email', async (req, res) => {
      const { email } = req.params;

      const result = await User.findOne({
            where: {
                  email
            }
      });

      if (result) {
            res.status(200).send({ exists: true });
      } else {
            res.status(200).send({ exists: false });
      }
});

module.exports = router;