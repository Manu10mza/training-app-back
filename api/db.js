require("dotenv").config();
const { Sequelize } = require("sequelize");
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;
const fs = require("fs");
const path = require("path");
const { dirname, basename } = require("path");

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/trainingapp`,
  { logging: false }
);
//Verificamos que se haya conectado
sequelize
  .authenticate()
  .then(() => console.log("Conection Success..."))
  .catch((err) => console.log("Error in connection: ", err));

const dirName = path.basename(__filename);
const modelDefiners = [];

//Inyectamos los modelos
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== dirName && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });
modelDefiners.forEach((model) => model(sequelize));

const User = sequelize.models.User;
const Exercise = sequelize.models.Exercise;
const Rutines = sequelize.models.Rutines;
const Recipe = sequelize.models.Recipe;
const Diet = sequelize.models.Diet;
const Transactions = sequelize.models.Transactions;

User.hasMany(Exercise);
Exercise.belongsTo(User);

User.hasMany(Recipe);
Recipe.belongsTo(User);

//Modelo N a M Usuario Dieta
User.belongsToMany(Diet, { through: "User_diets" });
Diet.belongsToMany(User, { through: "User_diets" });
//Modelo N a M Usuario Rutinas
User.belongsToMany(Rutines, { through: "User_rutines" });
Rutines.belongsToMany(User, { through: "User_rutines" });

console.log(sequelize.models);

module.exports = sequelize;
