const router = require('express').Router(); 
const CryptoJS = require('crypto-js'); //PARA DESENCRIPTAR EL PASSWORD
const jwt = require('jsonwebtoken') //REQUIRE JSON WEB TOKEN PARA CREAR TOKEN DE AUTHORIZACION
const sequelize = require('../db'); //LA BASE DE DATOS
const User = sequelize.models.User; //EL MODELO USER

router.post('/login', async (req, res) =>{
      /*Nos envian el mail y la contraseña por body */
      let result = await User.findOne({
            where:{
                  email: req.body.email
            }
      });
      //De está manera accedemos a los valores 
      const userDb = result?.dataValues
      if(userDb){
            //Desencriptamos la contraseña
            const userPassword = CryptoJS.AES.decrypt(userDb.password,process.env.PASSWORD_KEY).toString(CryptoJS.enc.Utf8);
            //Verificamos que sean las contraseñas iguales
            if(userPassword === req.body.password){
                  //Creamos el token de acceso
                  const accessToken = jwt.sign({
                        id: userDb._id,
                        isAdmin: userDb.isAdmin
                  }, process.env.JWT_KEY, { expiresIn: '5d' });
                  return res.status(200).json( {user:userDb,accessToken} );
            }
            return res.status(400).json({error: "Invalid password"})
      }

      return res.status(400).json({error: "Invalid email"})
});

/*
      Todo: Crear ruta de eliminacion de usuario
 */


module.exports = router;