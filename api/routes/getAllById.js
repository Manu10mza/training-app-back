const router = require("express").Router();
const { verifyToken } = require("../controllers/verifyToken");
const sequelize = require("../db");
const { Diet, User, Routine } = sequelize.models;

/**
 * devuelve un elemento definido por ID.
 * @params  {id} cualquier ID
 * @response [trainer || nutricionist || diet || rutine]
 */
router.get("/all/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "You must provide an ID." });
  }
  //filtra solo nutricionistas o trainers
  const Providers = await User.filter(
    (e) => e.is_nutritionist || e.is_personal_trainer
  );

  const targetUser = await Providers.findOne({
    where: {
      id,
    },
  }).catch(() => false);

  const targetDiet = await Diet.findOne({
    where: {
      id,
    },
  }).catch(() => false);

  const targetRutine = await Routine.findOne({
    where: {
      id,
    },
  }).catch(() => false);

  if (targetUser) {
    return res.status(200).send(targetUser);
  } else if (targetRutine) {
    return res.status(200).send(targetRutine);
  } else if (targetDiet) {
    return res.status(200).send(targetDiet);
  } else {
    return res.status(404).send("ID not found");
  }
});
