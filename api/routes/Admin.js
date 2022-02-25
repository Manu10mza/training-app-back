const router = require('express').Router();
const sequelize = require('../db'); //LA BASE DE DATOS
const { User, Recipe, Diet, Exercise, Routine } = sequelize.models; //EL MODELO USER
const { verifyAdminToken } = require('../controllers/verifyToken');

router.get('/allUsers',verifyAdminToken, async (req, res) => {


const users = await User.findAll({
    attributes: ['id', 'profile_img','is_nutritionist','is_personal_trainer'],
    include: [{
            model: Diet,
            attributes: ['id']
        }, {
            model: Exercise,
            attributes: ['id']
        }, {
            model: Recipe,
            attributes: ['id']
        }, {
            model: Routine,
            attributes: ['id']
        }]
}).then(result => result.map(e=> {

    //Guardo la data necesaria, en caso de ser vacía no se envía
    const values={};
    e?.Exercises.length?values.exercises=e.Exercises.map(entry => ({ id: entry.dataValues.id})):null;
    e?.Recipes.length?values.recipes=e.Recipes.map(entry => ({ id: entry.dataValues.id})):null;
    e?.Diets.length?values.diets=e.Diets.map(entry => ({ id: entry.dataValues.User_diets.DietId })):null;
    e?.Routines.length?values.routines=e.Routines.map(entry => ({ id: entry.dataValues.User_routines.RoutineId })):null;
    e?.is_personal_trainer?values.is_personal_trainer=true:null;
    e?.is_nutritionist?values.is_nutritionist=true:null

    return {
            id:e.dataValues.id,
            profile_img:e.dataValues.profile_img,
            ...values
        };
}));
    return res.status(200).send(users);
});
module.exports = router;