const router = require('express').Router(); 
const CryptoJS = require('crypto-js'); //PARA DESENCRIPTAR EL PASSWORD
const jwt = require('jsonwebtoken') //REQUIRE JSON WEB TOKEN PARA CREAR TOKEN DE AUTHORIZACION
const sequelize = require('../db'); //LA BASE DE DATOS
const User = sequelize.models.User; //EL MODELO USER
const { verifyToken } = require('../controllers/verifyToken');

//LOGEO
router.post('/login', async (req, res) =>{
      //Para loguearse deben enviar Username o Mail
      let result;
      if(req.body.username){
            result = await User.findOne({
                  where:{
                        username: req.body.username
                  }
            })
      } else if(req.body.email) {
            result = await User.findOne({
                  where:{
                        email: req.body.email
                  }
            });
      } else {
            return res.status(400).json({error:"The necessary data to enter was not sent"});
      }
      //De está manera accedemos a los valores 
      const userDb = result?.dataValues
      if(userDb){
            //Desencriptamos la contraseña
            const userPassword = CryptoJS.AES.decrypt(userDb.password,process.env.PASSWORD_KEY).toString(CryptoJS.enc.Utf8);
            //Verificamos que sean las contraseñas iguales
            if(userPassword === req.body.password){
                  userDb.password = userPassword;
                  
                  //Evaluamos su rol
                  let role;
                  if(userDb.is_nutritionist){
                        if(userDb.is_personal_trainer){
                              role = 'Nutritionist PTrainer';
                        } else{
                              role = 'Nutritionist';
                        };
                  } else if(userDb.is_personal_trainer){
                        role = 'PTrainer';
                  } else {
                        role = 'Client';
                  }
                  
                  //Creamos el token de acceso
                  const accessToken = jwt.sign({
                        userId: userDb.id,
                        role
                  }, process.env.JWT_KEY, { expiresIn: 60 * 60 * 24 });
                  return res.status(200).json( {user:userDb,accessToken} );
            }
            return res.status(400).json({error: "Invalid password"})
      }
      return res.status(400).json({error: "Invalid email"})
});

router.get('/', verifyToken, (req, res) =>{
      res.status(200).send('Hola')
});

/*
      Todo: Crear ruta de modificacion de usuario
      Todo: Crear ruta de eliminacion de usuario
 */


module.exports = router;