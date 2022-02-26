const router = require('express').Router();
const sequelize = require('../db');
const { verifyToken, verifyNutritionistToken } = require('../controllers/verifyToken');
const Recipe = sequelize.models.Recipe;
const User = sequelize.models.User;

//CREAR UNA RECETA
router.post('/:userId', verifyNutritionistToken, async (req, res) => {
    //Buscamos el usuario que está por crear la receta
    const user = await User.findOne({
        where: {
            id: req.params.userId
        }
    });
    //Nos aseguramos que este exista
    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    };

    //Se necesita haber proporcionado al menos el titulo
    if (!req.body.title) {
        return res.status(400).json({ error: 'You must provide a title.' });
    };
    //Nos aseguramos de que no existe algo con el mismo titulo
    const findRecipe = await Recipe.findOne({
        where: {
            title: req.body.title
        }
    })

    if (!findRecipe) {
        try {
            const recipe = await Recipe.create(req.body);
            //Vinculamos el usuario con la receta
            await user.addRecipe(recipe);
            return res.status(200).json({ success: 'Recipe created successfully' })

        } catch (error) {
            console.log(error)
            return res.status(400).json(error)
        }
    };
})


//TRAER TODAS LAS RECETAS DE PERTENECIENTE A UN USUARIO
router.get('/user/:userId', verifyToken, async (req, res) => {
    //Traemos todas las recetas que contenga un usuario
    const user = await User.findOne({
        where: {
            id: req.params.userId,
            disabled: false
        },
        include: Recipe
    });
    if (user) {
        return res.status(200).json(user.dataValues.Recipes);
    }
    res.status(400).json({ error: 'User not found' });
});


//BUSCA UNA RECETA EN ESPECIFICO
router.get('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const foundRecipe = await Recipe.findOne({
        where: {
            id,
            disabled: false
        }
    });

    if (foundRecipe) {
        res.status(200).json(foundRecipe);
    } else {
        res.status(404).json({ error: 'Invalid id.' });
    }
});


//MODIFICAR UNA RECETA
router.put('/:userId/:recipeId', verifyNutritionistToken, async (req, res) => {

    const { recipeId, userId } = req.params;
    const { carbohydrates, description, grease, grs, kcal, proteins, title } = req.body;
    //Buscamos la receta
    const targetRecipe = await Recipe.findOne({
        where: {
            id: recipeId
        }
    });

    //Evaluamos posibles conflictos

    let strings = []

    for (let [key, value] of Object.entries(targetRecipe.dataValues)) if (typeof value === 'string') strings.push(key)

    let nonstrings = []

    for (let [key, value] of Object.entries(req.body)) if (strings.includes(key) && typeof value !== 'string') nonstrings.push(key)
    if (nonstrings.length) return res.status(400).json({ error: "These values should be strings: " + nonstrings.join(', ') });//Ver si tal campo debe ser un string

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------

    let numbers = []

    for (let [key, value] of Object.entries(targetRecipe.dataValues)) if (typeof value === 'number') numbers.push(key)

    let negatives = []

    for (let [key, value] of Object.entries(req.body)) if (numbers.includes(key) && (Number(value) < 0 || Number(value) === NaN)) negatives.push(key)
    if (negatives.length) return res.status(400).json({ error: "These values are either negative or non-numeric, when they should't: " + negatives.join(', ') });//Ver si tal campo debe ser un numero

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------

    if (targetRecipe.dataValues.UserId !== userId) {
        return res.status(401).json({ error: 'This user doesn\'t own this recipe' });
    }

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------

    let emptyFields = []

    for (let [key, value] of Object.entries(req.body)) {
        if (!value && value !== 0) emptyFields.push(key)
    }

    if (emptyFields.length) {
        return res.status(400).json({ error: `No fields can be empty, please check: ${emptyFields.join(', ')}` }) //Ver que ningún campo esté vacio
    }

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------

    for (value in req.body) if (!targetRecipe.dataValues.hasOwnProperty(value)) return res.status(400).json({ error: `Invalid field name: ${value}` }); //Ver que todos los campos enviados existan en el modelo

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------

    //Actualizamos la receta

    for (let [key, value] of Object.entries(req.body)) {
        const success = Recipe.update({
            [key]: value
        }, {
            where: {
                id: recipeId
            }
        });
        if (!success) return res.status(500).json({ error: `Something went wrong when updating "${key}" with value "${value}". Please notify backend with code: REC149` })
    }

    return res.status(200).json({ success: 'Recipe updated successfully' })
});


//ELIINAR UNA RECETA
router.delete('/:userId/:recipeId', verifyNutritionistToken, async (req, res) => {
    const user = await User.findOne({
        where: {
            id: req.params.userId
        }
    });
    if (user) {
        let recipe = await Recipe.findOne({
            where: {
                id: req.params.recipeId
            }
        });
        if (recipe) {
            recipe.update({
                disabled: true
            });
            return res.status(200).json({ success: 'Recipe eliminated successfuly' })
        }
        return res.status(400).json({ error: 'Recipe not found' });
    }
    return res.status(400).json({ error: 'User not found' });
});
module.exports = router;