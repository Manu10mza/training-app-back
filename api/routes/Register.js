const router = require('express').Router();
const CryptoJS = require('crypto-js');
const sequelize = require('../db')
const User = sequelize.models.User

router.post('/', async (req, res)=>{
      //Encriptamos la contraseña antes de guardarla
      req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_KEY).toString();
      //Comprueba que no exista un email igual en la base de datos
      const result = await User.findOne({
            where:{
                  email: req.body.email
            }
      })
      if(!result){
            try {
                  await User.create(req.body);
                  return res.status(200).json({success:"User created successfuly"})
                  
            } catch (error) {
                  console.log(error);
                  return res.status(400).json(error)
            };
      }
      res.status(400).json({error:'User already exists'})

});


module.exports = router;