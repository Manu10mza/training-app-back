const router = require('express').Router();
const CryptoJS = require('crypto-js');
const sequelize = require('../db')
const User = sequelize.models.User

router.post('/', async (req, res)=>{
      /*Por Querys deben enviar el tipo de usuario que será*/
      let personal = req.query.isPersonalTraining;
      let nutritionist = req.query.isNutritionist;
      let model = req.body.user;
      //Encriptamos la contraseña antes de guardarla
      model.password = CryptoJS.AES.encrypt(model.password, process.env.PASSWORD_KEY).toString()

      //Comprueba que no exista un email igual en la base de datos
      const result = await User.findAll({
            where:{
                  email: model.email
            }
      })

      //En el caso de que sea personalTraining
      if(result.length === 0 && personal){
            model.isPersonalTraining = true;
            try {
                  await User.create(model);
                  return res.status(200).json({success:"successfully created personal trainer"})
                  
            } catch (error) {
                  console.log(error);
                  return res.status(200).json(error)
            };

      //En el caso de que sea nutritionist
      } else if(result.length === 0 && nutritionist){
            model.isNutritionist = true;
            try {
                  await User.create(model);
                  return res.status(200).json({success:"successfully created nutritionist"})
                  
            } catch (error) {
                  console.log(error);
                  return res.status(200).json(error)
            };

      //En el caso de que sea un simple cliente
      } else if(result.length === 0){
            /*En el caso de que solo sea un cliente */
            try {
                  await User.create(model);
                  return res.status(200).json({success:"successfully created client"})
            } catch (error) {
                  console.log(error);
                  return res.status(200).json(error)
            }

      }
      //Si es que ya existe un email igual en la base de datos
      res.status(400).json({error:'User already exists'})

});


module.exports = router;