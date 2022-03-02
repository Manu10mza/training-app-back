const router = require('express').Router();
const sequelize = require('../db');
const { User, Recipe, Diet, Exercise, Routine } = sequelize.models; 
const { verifyAdminToken } = require('../controllers/verifyToken');

//TRAER TODOS LOS PRODUCTOS
router.get('/products', verifyAdminToken, async (req,res)=>{
    const diets = await Diet.findAll();
    const routines = await Routine.findAll();
    res.status(200).json([...diets,...routines]);
});

//TRAE TODOS LOS USUARIOS CREADOS EN LA BASE DE DATOS
router.get('/users', verifyAdminToken, async (req, res) => {
    const result = await User.findAll();
    res.json(result)
});

//TRAE ESTADÍSTICAS DE REGISTROS MENSUALES
router.get('/monthlyUsers', verifyAdminToken, async (req, res) => {
    const users = await User.findAll();

    let months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Agu",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ]

    let result= {}

    users.map(e=>{
        let month = e.createdAt.toString().split(' ')[1]
        result.hasOwnProperty(month)?result[month]+=1:result[month]=1
    })

    let sorted = [...Object.keys(result)].sort((a,b)=>months.indexOf(a)-months.indexOf(b))

    let final={}

    sorted.map(e=>{final[e]=result[e]})

    res.json(final)

})

//OBTIENE LOS DETALLES DE CUALQUIER COSA DE LA CUAL SE PROPORCIONE EL ID
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


//ALTERNA EL ESTADO DE DESABILITACIÓN DE CUALQUIER OBJETO
router.delete('/:productId', verifyAdminToken, async(req,res)=>{    
    const { productId } = req.params
    //Comenzamos la busqueda en todas las tablas
    let result;
    //En el caso de que sea un usuario
    result = await User.findOne({
        where:{
            id : productId
        }
    });
    if(result){
        result.update({
            disabled : !result.disabled
        });
        return res.status(200).json({success: 'Eliminated successfuly'});
    };

    //En el caso de que sea una receta
    result = await Recipe.findOne({
        where:{
            id : productId
        }
    });
    if(result){
        result.update({
            disabled : !result.disabled
        })
        return res.status(200).json({success: 'Eliminated successfuly'});
    };

    //En el caso de que sea una rutina
    result = await Routine.findOne({
        where:{
            id : productId
        }
    });
    if(result){
        result.update({
            disabled : !result.disabled
        })
        return res.status(200).json({success: 'Eliminated successfuly'});
    };

    //En el caso de que sea un ejercicio
    result = await Exercise.findOne({
        where:{
            id : productId
        }
    });
    if(result){
        result.update({
            disabled : !result.disabled
        })
        return res.status(200).json({success: 'Eliminated successfuly'});
    }

    //En el caso de que sea una dieta
    result = await Diet.findOne({
        where:{
            id : productId
        }
    });
    if(result){
        result.update({
            disabled : !result.disabled
        })
        return res.status(200).json({success: 'Eliminated successfuly'});
    };

    res.status(400).json({error: 'Product not found'});
});


//ACTUALIZAR UN PRODUCTO
router.put('/:productId', verifyAdminToken, async (req,res)=>{
    res.send('Hola')
});

  
module.exports = router;