const router = require('express').Router();
const sequelize = require('../db');
const {verifyToken,verifyPTrainerToken} = require('../controllers/verifyToken');
const Exercise = sequelize.models.Exercise;
const User = sequelize.models.User;

//CREAR UN EJERCICIO
router.post("/",verifyPTrainerToken, async (req,res)=>{
    const { title,description,video }=req.body.exercise;
    const user = await User.findOne({
        where:{
            id : req.body.userId
        }
    });

    //Verificamos que exista el usuario
    if(user){
        //Verificamos que hayan enviado los datos
        if(title && description && video){
            const findExercise = await Exercise.findOne({
                where:{
                    title: title
                }
            });

            //Verificamos que no haya otro ejercicio con el mismo nombre
            if(!findExercise){
                try {
                    const newExercise = await Exercise.create(req.body.exercise);
                    user.addExercise(newExercise);
                    return res.status(200).json({success: 'Exercise created successfully'})
                    
                } catch (error) {
                    console.log(error)
                    return res.status(400).json(error);
                };
            } else{
                return res.status(400).json({error:'An exercise with that title already exists'})
            } 
        } else{
            return res.status(400).json({error:'Missing required data'});
        }
    } else {
        return res.status(400).json({error:'User not found'});
    }
});

//OBTENER TODOS LOS EJERICICIOS DE UN USUARIO
router.get('/', verifyToken, async (req,res)=>{
    const user = await User.findOne({
        where:{
            id : req.body.userId
        },
        include: Exercise
    });

    if(user){
        const exercises = user.dataValues.Exercises.map(item => item.dataValues);        
        res.status(200).json(exercises);
    } else {
        return res.status(400).json({error:"User not found"});
    }
});


//OBTENER UN EJERCICIO ESPECIFICO
router.get('/:id',verifyToken, async (req,res)=>{
    const { id } = req.params;
    try{
        let result = await Exercise.findAll({
            where:{
                id
            }
        });
        return res.status(200).json(result);

    } catch(error) {
        return res.status(400).json({error});
    }
});

module.exports = router;