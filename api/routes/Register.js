const router = require('express').Router();
const sequelize = require('../db')
const User = sequelize.models.User

router.post('/', async (req, res)=>{
      /*Por Querys deben enviar el tipo de usuario que será*/
      let personal = req.query.isPersonalTraining;
      let nutritionist = req.query.isNutritionist;
      let model = req.body.user;

      const result = await User.findAll({
            where:{
                  email: model.email
            }
      })

      if(!result && personal){
            model.isPersonalTraining = true;
            model.isNutritionist = false
            try {
                  await User.create(model);
                  res.status(200).json({success:"successfully created personal trainer"})
                  
            } catch (error) {
                  console.log(error);
                  res.status(200).json(error)
            };

      } else if(!result && nutritionist){
            model.isPersonalTraining = false;
            model.isNutritionist = true;

            try {
                  await User.create(model);
                  res.status(200).json({success:"successfully created nutritionist"})
                  
            } catch (error) {
                  console.log(error);
                  res.status(200).json(error)
            };
      } else if(!result){
            /*En el caso de que solo sea un cliente */
            model.isPersonalTraining = false;
            model.isNutritionist = false;
            try {
                  await User.create(model);
                  res.status(200).json({success:"successfully created client"})
            } catch (error) {
                  console.log(error);
                  res.status(200).json(error)
            }
      } else{
            res.status(400).json({error:'Username error'})
      };
});


module.exports = router;