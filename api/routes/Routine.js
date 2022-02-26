const router = require('express').Router();
const { Routine, Review, User } = require('../db.js').models;
const { verifyPTrainerToken, verifyToken } = require('../controllers/verifyToken');

//CREAR UNA RUTINA
router.post("/:ownerId", async (req, res) => {
  try {
    const { title, exercises, price } = req.body;
    const { ownerId } = req.params;

    //Se verifica si falta algun dato necesario
    if (!title || !exercises || !ownerId || !price) {
      return res.status(400).json({ error: "Missing required data" });
    }
    //Se verifica si el arreglo exercises tiene la forma correcta
    if (exercises.length !== 7)
      return res.status(400).json({
        error:
          "Array length should be 7 (at least one exercise per day, or Null on some day with no exercise)",
      });
    if (!Array.isArray(exercises[0]))
      return res.status(400).json({
        error:
          "Invalid exercise; Ej:[[{Exercise1-Monday},{Exercise2-Monday}],[{Exercise1-Tuesday},{Exercise2-Tuesday}]...]",
      });

    //Comprobación del precio (price>=0 y debe ser un número)
    if (isNaN(price * 1) || price < 0)
      return res.status(400).json({ error: "Invalid price" });

    //Se guardan los ejercicios correspondientes a cada día de la semana
    let weekDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const days = {};
    exercises.forEach((e, i) => {
      if (e) {
        days[weekDays[i]] = e;
      }
    });

    const newRutine = await Routine.create({
      title,
      owner: ownerId,
      days,
      price,
    });
    res.status(200).send(newRutine);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

//TRAE TODAS LAS RUTINAS DE UN USUARIO
router.get('/getUserRoutines/:userId', verifyToken, async (req, res)=>{
    const {userId} = req.params;
    const userResult = await User.findOne({
        include : Routine,
        where:{
            id : userId
        }
    });

    if(userResult){
        return res.json(userResult.Routines)
    }
    res.send(400).json({error:'User not found'});
})

//BUSCAR RUTINA POR ID
router.get('/get/:routineId', async (req, res) => {
    const id = req.params.routineId;
    let result = await Routine.findOne({
        where: {
            id
        }
    });
    if (result) return res.status(200).json(result);
    return res.status(400).json({ error: 'Routine not found' });
});


//ACTUALIZAR UNA RUTINA YA EXISTENTE
router.put(
  "/update/:ownerId/:rutineId",
  verifyPTrainerToken,
  async (req, res) => {
    try {
      let { value } = req.body;
      const { ownerId, rutineId } = req.params;
      let weekDays = [];
      let days = {};
      let updateValue = {}; //Objeto que tendrá los valores a actualizar

      //Se busca la rutina a actualizar
      let rutine = await Routine.findByPk(rutineId)
        .then((r) => r.dataValues)
        .catch((e) => "Routine not found");

      //Se compruebba si el usuario es el creador de la rutina
      if (rutine.owner !== ownerId)
        return res
          .status(400)
          .json({ error: "The user is not the creator of the routine" });

      //Se lee el objeto value y se comprueba si alguna propiedad enviada no existe en el modelo
      for (const key in value) {
        if (!rutine[key] && key !== "exercises")
          return res
            .status(400)
            .json({ error: `Invalid field name -> ${key}` });
        //El Owner no puede cambiarse
        if (key === "owner") {
          return res.status(400).json({ error: "The owner cannot be changed" });
        }
      }

      //Se verifica que el arreglo exercise tiene la forma correcta
      if (value.exercises && Array.isArray(value.exercises[0])) {
        if (value.exercises.length !== 7)
          return res.status(400).json({
            error:
              "Array length should be 7 (at least one exercise per day, or Null on some day with no exercise)",
          });
        weekDays = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];
        days = {};

        //Guardo los datos por día de la semana
        value.exercises.forEach((e, i) => {
          if (e) {
            days[weekDays[i]] = e;
          }
        });
        value.days = "days";
        updateValue.days = days;
        //Si entra al próximo if es por que exercise no tenia la forma correcta
      } else if (value.exercises)
        return res.status(400).json({
          error:
            "Invalid exercise; Ej:[[{Exercise1-Monday},{Exercise2-Monday}],[{Exercise1-Tuesday},{Exercise2-Tuesday}]...]",
        });

      //Se verifica si el precio es valido
      if (value.price && !isNaN(value.price * 1) && value.price >= 0)
        updateValue.price = value.price;
      if (value.title) updateValue.title = value.title;

      let updateSucess;
      //Se itera por todo el objeto value y se actualiza en la base de datos
      for (const key in value) {
        if (key !== "exercises") {
          updateSucess = await Routine.update(
            {
              [key]: updateValue[key],
            },
            {
              where: {
                id: rutineId,
              },
            }
          );

          if (!updateSucess)
            return res.status(400).json({ error: "Error updating routine" });
        }
      }
      const rutineUpdated = await Routine.findByPk(rutineId);
      res.status(200).send(rutineUpdated);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
);

//TRAER TODAS LAS RUTINAS DE LA DB
router.get("/", async (req, res) => {
  const result = await Routine.findAll({
    attributes: ["id", "price"],
    include: [
      {
        model: User,
        attributes: [
          "id",
          "is_nutritionist",
          "is_personal_trainer",
          "profile_img",
        ],
      },
      {
        model: Review,
        attributes: ["points"],
      },
    ],
  }).then((result) =>
    result.map((entry) => ({
      ...entry.dataValues,
      Reviews: undefined, // ignore unwanted properties
      Users: undefined,
      owner: {
        ...entry.dataValues.Users[0].dataValues,
        User_routines: undefined,
      }, // *assuming Users has a single entry
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

/**
 * DELETE - Elimina una rutina.
 * @params  {id} routine's ID
 * @response "Routine eliminated"
 */
router.delete("/routine/:id", verifyPTrainerToken, async (req, res) => {
  try {
    const { id } = req.params;
    const routineID = await Routine.delete({
      where: {
        id,
      },
    });
    res.status(200).send("Routine eliminated");
  } catch (error) {
    res.status(400).send("DELETE routine route: ", error);
  }
});

module.exports = router;
