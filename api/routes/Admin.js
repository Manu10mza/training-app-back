const router = require('express').Router();
const sequelize = require('../db');
const { User, Recipe, Diet, Exercise, Routine } = sequelize.models; 
const { verifyAdminToken, verifyToken } = require('../controllers/verifyToken');

//Ruta que trae todos los usuarios creados en la base de datos
router.get('/users', verifyAdminToken, async (req, res) => {
    const result = await User.findAll();
    res.json(result)
});

//OBTIENE LOS DETALLES DE CUALQUIER COSA DEL QUE SE ENVIE EL ID
router.get('/:productId', verifyAdminToken, async (req,res)=>{
    //Busca en la tabla de usuarios
    const userResult = await User.findOne({
        where:{
                id: req.params.productId
        }
    });
    if(userResult) return res.status(200).json({success: userResult});
    //Busca en la tabla de recetas
    const recipeResult = await Recipe.findOne({
        where:{
                id: req.params.productId
        }
    });
    if(recipeResult) return res.status(200).json({success: recipeResult});
    //Busca en la tabla de ejericicos
    const exerciseResult = await Exercise.findOne({
        where:{
                id : req.params.productId
        }
    });
    if(exerciseResult) return res.status(200).json({success: exerciseResult})
    //Busca en la tabla de rutinas
    const routineResult = await Routine.findOne({
        where:{
                id: req.params.productId
        }
    });
    if(routineResult) return res.status(200).json({error: routineResult});
    //Busca en la tabla de dietas
    const dietResult = await Diet.findOne({
        where:{
                id : req.params.productId
        }
    });
    if(dietResult) return res.status(200).json({success: dietResult});
    //Si llega a est punto sin retornar nada no se encuentra el producto
    return res.status(400).json({error:'Product not found'});
});


//EN ESTE ENDPOINT LE LLEGA EL ID DEL PRODUCTO A ELIMINAR
router.delete('/:productId',verifyAdminToken, async(req,res)=>{    
    res.send('Working...')
});

module.exports = router;