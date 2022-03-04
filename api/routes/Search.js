const router = require("express").Router();
const sequelize = require("../db");
const {Op} = require('sequelize');
const { Diet, Routine, User } = sequelize.models;

router.get('/:search', async (req, res)=>{
      let result;
      const { search } = req.params;

      //BUSCAMOS LAS DIETAS
      if(req.query.diets ){
            result = await Diet.findAll({
                  include:{
                        model: User,
                        attributes: [
                              "id",
                              "username",
                              "email",
                              "is_nutritionist",
                              "is_personal_trainer",
                              "profile_img",
                        ]
                  },
                  where:{
                        title : {[Op.like] : `${search}%`},
                        disabled : false
                  }
                  //En este then lo que hacemos es reemplazar los datos de owner con los datos ya encontrados del usuario propietario
            }).then( data => data.map( item => ({
                  ...item.dataValues,
                  owner : item.dataValues.Users[0].dataValues 
            })));

            return res.status(200).json(result);
      }
      //BUSCAMOS LAS RUTINAS
      if(req.query.routines){
            result = await Routine.findAll({
                  include:{
                        model: User,
                        attributes: [
                              "id",
                              "username",
                              "email",
                              "is_nutritionist",
                              "is_personal_trainer",
                              "profile_img",
                        ]
                  },
                  where:{
                        title : {[Op.like] : `${search}%`},
                        disabled : false
                  }
            }).then( data => data.map( item => ({
                  ...item.dataValues,
                  owner : item.dataValues.Users[0].dataValues 
            })));
            return res.status(200).json(result);

      //BUSCAMOS NUTRICIONISTAS
      } else if(req.query.nutritionist){
            result = await User.findAll({
                  where: {
                        username : {[Op.like] : `${search}%`},
                        is_nutritionist : true,
                        disabled : false
                  }
            }).then(data => data.map(item => item.dataValues));
            return res.status(200).json(result);

      //BUSCAMOS PERSONAL TRAINERS
      } else if(req.query.PTrainers){
            result = await User.findAll({
                  where: {
                        username : {[Op.like] : `${search}%`},
                        is_personal_trainer : true,
                        disabled : false
                  }
            }).then(data => data.map(item => item.dataValues))
            return res.status(200).json(result);
      }
})

module.exports = router;