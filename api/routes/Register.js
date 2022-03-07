const router = require("express").Router();
const sequelize = require("../db");
const User = sequelize.models.User;
const { encrypt, decrypt } = require("../controllers/encrypt");

router.post("/", async (req, res) => {
  //Encriptamos la contraseña antes de guardarla
  let {email,username,password} = req.body
  if(!email||!username||!password) return res.status(400).json({ error: "Some fields where empty" });
  let encryptedPassword = encrypt(req.body.password);
  console.log(encryptedPassword)
  req.body.nro_acount
    ? (req.body.nro_acount = encrypt(req.body.nro_acount))
    : "";
  //Comprueba que no exista un email igual en la base de datos
  const result = await User.findOne({
    where: {
      email
    },
  });
  if (!result) {
    try {
      await User.create({email, username, password:encryptedPassword});
      console.log(await User.findOne({
        where: {
          email
        },
      }))
      return res.status(200).json({ success: "User created successfuly" });
    } catch (error) {
      console.log("Este es el error: ", error);
      return res.status(400).json(error);
    }
  }
  res.status(400).json({ error: "User already exists" });
});

module.exports = router;
