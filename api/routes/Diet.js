const router = require("express").Router();
const { verifyToken, verifyNutritionistToken } = require("../controllers/verifyToken");
const sequelize = require("../db");
const { Diet, User, Recipe, Review } = sequelize.models;

//CREAR DIETAS
router.post("/:userId", verifyNutritionistToken, async (req, res) => {
    const { title, price, plain } = req.body;
    const owner = req.params.userId;

    if (!title || !price || !owner || !plain) {
        return res
            .status(400)
            .json({ success: false, message: "Invalid data format." });
    }
    //BUSCAMOS EL USUARIO PARA COMPROBAR DE QUE ESTÉ REGISTRADO EN LA DB
    const userResult = await User.findOne({
        where: {
            id: owner,
        },
    });
    if (!userResult) return res.status(400).json({ error: "User not found" });

    //Se busca que no exista una dieta con ese titulo
    const dietResult = await Diet.findOne({
        where: {
            title,
        },
    });
    if (dietResult)
        return res
            .status(200)
            .json({ error: "Ya existe una dieta con ese titulo", dietResult });

    //SE CREA LA DIETA CON LOS DATOS PROPORCIONADOS
    try {
        const diet = await Diet.create({ ...req.body, owner });
        return res.status(200).json("Successfuly created diet");
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
});


//TRAER TODAS LAS DIETAS DE LA DB
router.get('/', verifyToken, async (req, res) => {
    const result = await Diet.findAll({
        attributes: ["id", "price"],
        include: [
            {
                model: User,
                attributes: [
                    "id",
                    "is_nutritionist",
                    "is_personal_trainer",
                    "profile_img",
                ]
            },
            {
                model: Review,
                attributes: ["points"],
            },
        ]
    }, {
        where: {
            disabled: false
        }
    }).then((result) =>
        result.map((entry) => ({
            ...entry.dataValues,
            Reviews: undefined, // ignore unwanted properties
            Users: undefined,
            owner: { ...entry.dataValues.Users[0].dataValues, User_diets: undefined }, // *assuming Users has a single entry
            reviews: entry.dataValues.Reviews.length,
            rating:
                entry.dataValues.Reviews.map((e) => e.points).reduce(
                    (p, c) => p + c,
                    0
                ) / entry.dataValues.Reviews.length,
        }))
    );

    res.status(200).json(result);
});


//OBTENER DIETA SEGUN ID
router.get("/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res
            .status(400)
            .json({ success: false, message: "You must provide a user ID." });
    }

    const target = await User.findOne({
        where: {
            id,
        },
    }).catch(() => false);

    if (!target) {
        return res.status(404).json({ success: false, message: "User not found." });
    }

    const targetDiets = await target.getDiets();

    const response = targetDiets.map((diet) => {
        return {
            diet_id: diet.id,
            owner_id: diet.owner,
            price: diet.price,
            title: diet.title,
            plain: diet.plain,
        };
    });

    if (targetDiets) {
        res.status(200).json({ success: true, result: response });
    } else {
        res
            .status(404)
            .json({ success: false, message: "User has not created any diets." });
    }
});


//EDITAR UNA DIETA
// router.put("/update/:userId/:dietId", verifyNutritionistToken, async (req, res) => {
//     try {
//         const { title, price, plan } = req.body;
//         const { userId, dietId } = req.params;
//         let updateValues = {};

//         //Debe enviarse al menos un dato
//         if (!title && !price && !userId && !plan) {
//             return res
//                 .status(400)
//                 .json({ success: false, message: "Invalid data format" });
//         }
//         if (title) updateValues.title = title;
//         //El precio debe ser mayor o igual a 0
//         if (price && !isNaN(price * 1) && price >= 0) updateValues.price = price;

//         let plain = {};

//         //Se arma el plan de la dieta, con sus recetas
//         if (plan) {
//             for (const entry of plan) {
//                 const day = entry.day;
//                 const course = entry.meals;
//                 for (const m in course) {
//                     const meal = await Recipe.findByPk(course[m]).then(
//                         (r) => r.dataValues
//                     );
//                     plain[day] = plain[day] || {};
//                     plain[day][m] = meal;
//                 }
//             }
//         }
//     )

//ELIMINAT DIETA
<<<<<<< HEAD
router.delete("/diet/:dietId", verifyNutritionistToken, async (req, res) => {
    const { dietId } = req.params;
    try {
        const result = await Diet.findOne({
            where: {
                id: dietId
            }
        });

        if (result) {
            result.update({
                disabled: true
            });
            return res.status(200).json({ success: 'Diet eliminated successfuly' });
        }
        return res.status(400).json({ error: 'Diet not found' });
    } catch (error) {
        res.status(400).json(error);
    }
=======
router.delete("/:dietId", verifyNutritionistToken, async (req, res) => {
  const { dietId } = req.params;
  const result = await Diet.findOne({
    where: {
      id: dietId
    }});

  if(result){
    try {
      result.update({
        disabled: true
      });

      return res.status(200).json({success: 'Diet eliminated successfuly'});
    } catch (error) {
      res.status(400).json(error);
    }
  }
  return res.status(400).json({error: 'Diet not found'});
>>>>>>> 2946513afa08664826bf1702837f4a97fe45bac3
});

module.exports = router;
