const { Router } = require("express");
const { Diets, Routines, Users } = require("../db");
const axios = require("axios");
const router = Router();

//Funciones
//trae todos los usuarios incluyendo los modelos Diets y Routines
const getDbInfo = async () => {
  try {
    return await Users.findAll({
      include: {
        model: Diets,
        attributes: ["id"],
        through: {
          attributes: [],
        },
        model: Routines,
        attributes: ["id"],
        through: {
          attributes: [],
        },
      },
    });
  } catch (error) {
    console.log("Error en la llamada a BD", error);
  }
};
//get devuelve un arreglo con [0] = Diets del usuario [1] = Rutinas del usuario.
router.get("/userDietsRoutines", async (req, res) => {
  try {
    const id = req.query.id;
    let userTotal = await getDbInfo();
    if (id) {
      let userId = await userTotal.filter((e) =>
        e.id.toLowerCase().includes(id.toLowerCase())
      );
      userId.length
        ? res.status(200).send([userId.Diets, userId.Routines])
        : res.status(404).send("User not found");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.log("Error en la ruta GET diets routine", error);
  }
});
