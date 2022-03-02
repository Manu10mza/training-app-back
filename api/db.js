require("dotenv").config();
const { Sequelize } = require("sequelize");
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;
const fs = require("fs");
const path = require("path");

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
// fs.readdirSync(path.join(__dirname, "/models"))
//   .filter((file) => file.indexOf(".") !== 0 && file !== dirName && file.slice(-3) === ".js")
//   .forEach((file) => {
//     modelDefiners.push(require(path.join(__dirname, "/models", file)));
//   });
// modelDefiners.forEach((model) => model(sequelize));

fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== dirName && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });
modelDefiners.forEach((model) => model(sequelize));

const { User, Exercise, Routine, Recipe, Diet, Transaction, Review } =
  sequelize.models;
//Generamos las relaciones
User.hasMany(Exercise);
Exercise.belongsTo(User);

User.hasMany(Recipe);
Recipe.belongsTo(User);

User.hasMany(Transaction);
Transaction.belongsTo(User);

User.belongsToMany(Diet, { through: "User_diets" });
Diet.belongsToMany(User, { through: "User_diets" });

User.belongsToMany(Routine, { through: "User_routines" });
Routine.belongsToMany(User, { through: "User_routines" });

Exercise.belongsToMany(Routine, { through: "Routine_exercises" });
Routine.belongsToMany(Exercise, { through: "Routine_exercises" });

Recipe.belongsToMany(Diet, { through: "Diet_recipes" });
Diet.belongsToMany(Recipe, { through: "Diet_recipes" });

Diet.hasMany(Review);
Routine.hasMany(Review);

console.log(sequelize.models);
module.exports = sequelize;
