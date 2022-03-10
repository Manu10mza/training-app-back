const { decrypt, encrypt } = require("../controllers/encrypt");
const router = require("express").Router();
const jwt = require("jsonwebtoken"); //REQUIRE JSON WEB TOKEN PARA CREAR TOKEN DE AUTHORIZACION
const sequelize = require("../db"); //LA BASE DE DATOS
const { User, Recipe, Diet, Exercise, Routine } = sequelize.models; //EL MODELO USER
const { verifyToken } = require("../controllers/verifyToken");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

let result = [User, Recipe, Routine, Exercise, Diet];

//LOGEO
router.post("/login", async (req, res) => {
  //Para loguearse deben enviar Username o Mail
  //console.log(req.body.password)
  let result;
  if (req.body.username) {
    result = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
  } else if (req.body.email) {
    result = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
  } else {
    return res
      .status(400)
      .json({ error: "The necessary data to enter was not sent" });
  }
  //De está manera accedemos a los valores
  //console.log(result)
  const userDb = result?.dataValues;
  if (userDb) {
    //Desencriptamos la contraseña
    const userPassword = decrypt(userDb.password);
    console.log(userDb.password, userDb, decrypt(userDb.password));
    //Verificamos que sean las contraseñas iguales
    if (userPassword === req.body.password) {
      userDb.password = userPassword;

      //Evaluamos su rol
      let role = [];

      if (userDb.is_personal_trainer) role.push("PTrainer");
      if (userDb.is_nutritionist) role.push("Nutritionist");
      if (userDb.is_admin) role.push("Admin");
      if (!role) role.push("Client");

      role = role.join(" ");

      //Creamos el token de acceso
      const accessToken = jwt.sign(
        {
          userId: userDb.id,
          role,
        },
        process.env.JWT_KEY,
        { expiresIn: 60 * 60 * 24 }
      );

      return res.status(200).json({
        userId: userDb.id,
        username: userDb.username,
        email: userDb.email,
        profileImg: userDb.profile_img,
        PTrainer: userDb.is_personal_trainer,
        Nutritionist: userDb.is_nutritionist,
        isAdmin: userDb.is_admin,
        accessToken,
      });
    }
    return res.status(400).json({ error: "Invalid password" });
  }
  return res.status(400).json({ error: "Invalid email" });
});

router.get("/find/:userData", async (req, res) => {
  const result = await User.findOne({
    where: {
      [Op.or]: [
        { email: req.params.userData },
        { username: req.params.userData },
      ],
    },
  });
  console.log(result);
  if (result) return res.status(200).json(result);
  res.status(200).json({ error: "User not found" });
});

//OBTENER TODOS LOS DATOS DE UN USUARIO
router.get("/:userId", async (req, res) => {
  const result = await User.findOne({
    // findByPK
    attributes: [
      "id",
      "username",
      "email",
      "profile_img",
      "gender",
      "country",
      "training_days",
      "height",
      "weight",
      "createdAt",
      "is_nutritionist",
      "is_personal_trainer",
    ],
    where: {
      id: req.params.userId,
    },
  });
  if (result) return res.status(200).json(result);
  return res.status(400).json({ error: "User not found" });
});

//TRAE TODOS LOS NUTRISIONISTAS
router.get("/get/nutritionist", async (req, res) => {
  try {
    const result = await User.findAll({
      attributes: [
        "id",
        "profile_img",
        "username",
        "email",
        "gender",
        "country",
        "is_nutritionist",
        "is_personal_trainer",
      ],
      where: {
        is_nutritionist: true,
        disabled: false,
      },
    });
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

//TRAE TODOS LOS TRAINERS
router.get("/get/trainers", async (req, res) => {
  try {
    const trainers = await User.findAll({
      attributes: [
        "id",
        "profile_img",
        "username",
        "email",
        "gender",
        "country",
        "is_nutritionist",
        "is_personal_trainer",
      ],
      where: {
        is_personal_trainer: true,
        disabled: false,
      },
    });
    return res.status(200).json(trainers);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

//TRAE TODOS LOS PROFESIONALES
router.get("/get/professionals", async (req, res) => {
  try {
    const professionals = await User.findAll({
      attributes: [
        "id",
        "profile_img",
        "username",
        "email",
        "gender",
        "country",
        "is_nutritionist",
        "is_personal_trainer",
      ],
      where: {
        [Op.or]: [
          {
            is_personal_trainer: true,
          },
          {
            is_nutritionist: true,
          },
        ],
      },
    });
    return res.status(200).json(professionals);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

//MODIFICAR DATOS DEL USUARIO
router.put("/update/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;
  const { username, password, email, profile_img, disabled } = req.body;
  const targetUser = await User.findByPk(userId)
    .then((result) => result.dataValues)
    .catch(() => false);

  if (!targetUser)
    return res
      .status(400)
      .send({ error: "User ID was not found in the database." });
  //Evaluamos que lo que nos envían corresponda con lo que se debe guardar

  if (password && !/(?=.*\d).{8,}$/.test(password))
    return res.status(400).send({
      error: "Password must contain at least 8 characters and 1 number",
    });

  if (
    email &&
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  )
    return res.status(400).send({ error: "Invalid email format." });

  if (
    profile_img &&
    !/https?:\/\/.+(\.(a?png|gif|p?jpe?g|jfif|pjp|webp|pdf|svg|avif|jxl|bmp|ico|cur|tiff?))+[\s\S]*(media)+[\s\S]*/i.test(
      profile_img
    )
  )
    return res.status(400).send({ error: "Invalid image link." });

  if (username && username.length < 5)
    return res
      .status(400)
      .send({ error: "Username must be at least 5 characters long" });

  const success = await User.update(
    {
      password: password ? encrypt(password) : targetUser.password,
      username: username ? username : targetUser.username,
      email: email ? email : targetUser.email,
      profile_img: profile_img ? profile_img : targetUser.profile_img,
    },
    {
      where: {
        id: userId,
      },
    }
  ).then((result) => result[0]);

  if (success) {
    res.status(200).send({
      success: "Successfully updated user information: ",
      username,
      password,
      email,
      profile_img,
    });
  } else {
    res
      .status(500)
      .send({ error: "There was an error processing your request." });
  }
});

router.get("/:productId", async (req, res) => {
  for (let i = 0; i < result.length; i++) {
    let a = result[i].findOne({ where: { id: req.params.productId } });
    if (a) return res.status(200).json({ success: a });
  }

  res.status(400).json({ error: "No element matched the given ID" });
});

module.exports = router;
