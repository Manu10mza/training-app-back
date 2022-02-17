require('dotenv').config(); 
const { Sequelize } = require('sequelize');
const { DB_USER, DB_PASSWORD, DB_HOST, } = process.env;
const fs = require('fs');
const path = require('path');
const { dirname, basename } = require('path');

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/trainingapp`, { logging: false });
//Verificamos que se haya conectado 
sequelize.authenticate()
      .then(() => console.log('Conection Success...'))
      .catch(err => console.log('Error in connection: ', err));

const dirName = path.basename(__filename);
const modelDefiners = [];
      
//Inyectamos los modelos
fs.readdirSync(path.join(__dirname, '/models'))
      .filter((file) => (file.indexOf('.') !== 0) && (file !== dirName) && (file.slice(-3) === '.js'))
      .forEach((file) => {
            modelDefiners.push(require(path.join(__dirname, '/models', file)));
      });
modelDefiners.forEach(model => model(sequelize));

const { User, Exercise, Rutines, Recipe, Diet, Transactions } = sequelize.models;

User.hasMany(Exercise);
Exercise.belongsTo(User);

User.hasMany(Recipe);
Recipe.belongsTo(User);

User.hasMany(Diet);
Diet.belongsTo(User);




console.log(sequelize.models);


module.exports = sequelize;