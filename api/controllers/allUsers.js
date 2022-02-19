const { Diet, Routine, User } = require("../db");

/**
 * trae todos los usuarios incluyendo los modelos Diet y Routine
 * @database  User
 * @database  Diet - Routine (N x M relation)
 * @returns all users
 */

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

module.exports = {
  getDbInfo,
};
