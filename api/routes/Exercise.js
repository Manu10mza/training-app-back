const router = require('express').Router();
const sequelize = require('../db');
const { verifyToken, verifyPTrainerToken } = require('../controllers/verifyToken');
const Exercise = sequelize.models.Exercise;
const User = sequelize.models.User;

//CREAR UN EJERCICIO
router.post("/:userId", verifyToken, async (req, res) => {
    const { title, description, video } = req.body;
    const user = await User.findOne({
        where: {
            id: req.params.userId
        }
    });

    //Verificamos que exista el usuario
    if (user) {
        //Verificamos que hayan enviado los datos
        if (title && description && video) {
            const findExercise = await Exercise.findOne({
                where: {
                    title: title
                }
            });

            //Verificamos que no haya otro ejercicio con el mismo nombre
            if (!findExercise) {
                try {
                    const newExercise = await Exercise.create(req.body);
                    user.addExercise(newExercise);
                    return res.status(200).send(newExercise); //json({success: 'Exercise created successfully'}
                    
                } catch (error) {
                    console.log(error);
                    return res.status(400).json(error);
                };
            } else {
                return res.status(400).json({ error: 'An exercise with that title already exists' });
            } 
        } else {
            return res.status(400).json({ error: 'Missing required data' });
        }
    } else {
        return res.status(400).json({ error: 'User not found' });
    }
});


//OBTENER TODOS LOS EJERICICIOS DE UN USUARIO
router.get('/user/:userId', verifyToken, async (req, res) => {
    const user = await User.findOne({
        where: {
            id: req.params.userId
        },
        include: Exercise
    });

    if (user) {
        const exercises = user.dataValues.Exercises.map(item => item.dataValues);        
        res.status(200).json(exercises);
    } else {
        return res.status(400).json({ error: "User not found" });
    }
});


//OBTENER UN EJERCICIO ESPECIFICO
router.get('/:id', verifyToken, async (req, res) => {
    try {
        let result = await Exercise.findAll({
            where: {
                id: req.params.id
            }
        });
        return res.status(200).send(result);

    } catch (error) {
        return res.status(400).json({ error });
    }
});


//EDITAR UNA PUBLICACION
router.put('/update/:userId/:exerciseId', verifyToken, async (req, res) => {

    const { exerciseId, userId } = req.params;
    const { value } = req.body;
    let updateValue = {};
    let isOwner;

    if (!value) return res.status(400).send({ error: "Value is required" });

    let user = await User.findOne({
        include: Exercise,
        where: {
            id: userId
        }
    }).then(r => r && r.dataValues).catch(() => false);
    isOwner = user?.Exercises.find(e => e.dataValues.id === exerciseId);
    if (!isOwner) return res.status(400).send({ error: "The user does not own this exercise" });

    if (value.title) updateValue.title = value.title;
    if (value.description) updateValue.description = value.description;
    if (value.video) updateValue.video = value.video;


    for (const key in value) {
        let success = await Exercise.update({
            [key]: updateValue[key]
        }, {
            where: {
                id: exerciseId
            }
        });
        if (!success) return res.status(400).send({ error: "Error updating exercise" });
    }
    let exercise = await Exercise.findByPk(exerciseId);
    return res.status(200).send(exercise);

});

module.exports = router;