const router = require('express').Router();
const sequelize = require('../db');
const { verifyToken, verifyPTrainerToken } = require('../controllers/verifyToken');
const {User,Recipe,Exercise,Routine, Diet} = sequelize.models;

//RUTA PARA OBTENER LOS DETALLES DEL OBJETO DEL CUAL PROPORCIONAN SU ID
router.get('/:userId/:objectId', verifyToken, async (req,res)=>{
      const user = await User.findOne({
            where:{
                  id : req.params.userId
            }
      });

      console.log(req.params.objectId);
      if(user){
            const userResult = await User.findOne({
                  where:{
                        id: req.params.userId
                  }
            })
            if(userResult) return res.status(200).json({success: userResult});
            const recipeResult = await Recipe.findOne({
                  where:{
                        id: req.params.objectId
                  }
            });
            if(recipeResult) return res.status(200).json({success: recipeResult});
            const exerciseResult = await Exercise.findOne({
                  where:{
                        id : req.params.objectId
                  }
            });
            if(exerciseResult) return res.status(200).json({success: exerciseResult})
            const routineResult = await Routine.findOne({
                  where:{
                        id: req.params.objectId
                  }
            });
            if(routineResult) return res.status(200).json({error: routineResult});
            const dietResult = await Diet.findOne({
                  where:{
                        id : req.params.objectId
                  }
            });
            if(dietResult) return res.status(200).json({success: dietResult});

            return res.status(400).json({error:'Product not found'})
      }
      return res.status(400).json({error: 'User not found'});
})

router.delete('/:userId/:objectId', verifyToken, async (req,res)=>{



})

module.exports = router;