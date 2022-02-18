const { Router } = require("express");
const { Diet, Routine, User } = require("../db");

const router = Router();

/*
!ESTO NO DEBERÍA ESTAR EN ESTA CARPETA, DEBERIA ESTAR EN CONTROLLERS
*/

//Funciones
//trae todos los usuarios incluyendo los modelos Diet y Routine
const getDbInfo = async () => {
  try {
    return await User.findAll({
      include: {
        model: Diet,
        attributes: ["id"],
        through: {
          attributes: [],
        },
        model: Routine,
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
//get devuelve un arreglo con [0] = Diet del usuario [1] = Rutinas del usuario.
router.get("/userDietsRoutines", async (req, res) => {
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
//para llamar a esta ruta, se deberá primero validar desde el front q el ID existe en la lista del personal/nutricionista
router.get("/soldItems", async (req, res) => {
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
    //aca se asume que el id del producto existe, que esta checkeado desde el front, por eso no manda status(404)
    usersDiets.length
      ? res.status(200).send(usersDiets)
      : res.status(200).send(usersRoutines);
  } catch (error) {
    console.log(error);
  }
});
