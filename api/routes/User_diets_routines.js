const { Router } = require("express");
const { Diet, Routine, User } = require("../db");
const { getDbInfo } = require("../controllers/allUsers.js");
const { verifyToken } = require("../controllers/verifyToken");

const router = Router();

/**
 * devuelve un arreglo con [0] = Diet del usuario [1] = Rutinas del usuario.
 * @query  {id} user's id
 * @response [user diets, user routines]
 */
router.get("/userDietsRoutines", verifyToken, async (req, res) => {
  try {
    const id = req.query.id;
    let userTotal = await getDbInfo();
    if (id) {
      let userId = await userTotal.filter((e) =>
        e.id.toLowerCase().includes(id.toLowerCase())
      );
      userId.length
        ? res.status(200).send([userId.Diet, userId.Routine])
        : res.status(404).send("User not found");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.log("Error en la ruta GET diets routine", error);
  }
});

/**
 * Devuelve los usuarios que compraron cierta dieta o rutina especificada por query.
 * @query  {id} item's id
 * @response sends all users who bought the item
 * @considerations para llamar a esta ruta,
 *  se deberá primero validar desde el front q el ID existe
 *  en la lista del personal/nutricionista
 */
router.get("/soldItems", verifyToken, async (req, res) => {
  //call all users as an array
  let userTotal = await getDbInfo();
  //recieve the product id
  const idProduct = req.query.id;
  try {
    let usersDiets = await userTotal.filter((e) =>
      e.diets.some((d) => d === idProduct)
    );

    let usersRoutines = await userTotal.filter((e) =>
      e.routines.some((d) => d === idProduct)
    );
    //aca se asume que el id del producto existe,
    //que esta checkeado desde el front, por eso no manda status(404)
    usersDiets.length
      ? res.status(200).send(usersDiets)
      : res.status(200).send(usersRoutines);
  } catch (error) {
    console.log("Error en la ruta soldItems", error);
  }
});
