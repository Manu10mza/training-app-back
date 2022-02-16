const { DataTypes } = require("sequelize");

const User = (sequelize) =>{
      sequelize.define('User',{
            id:{
                  type: DataTypes.UUID,
                  defaultValue: DataTypes.UUIDV4,
                  primaryKey:true
            },
            email:{
                  type: DataTypes.STRING,
                  allowNull: false
            },
            password:{
                  type: DataTypes.STRING,
                  allowNull: false
            },
            profile_img:{
                  type: DataTypes.STRING,
                  allowNull: true
            },
            genre:{
                  type: DataTypes.STRING,
                  allowNull: true
            },
            country:{
                  type: DataTypes.STRING,
                  allowNull: true
            },
            is_nutritionist:{
                  type: DataTypes.BOOLEAN,
                  defaultValue: false,
                  allowNull: true
            },
            is_personalTraining:{
                  type: DataTypes.BOOLEAN,
                  defaultValue: false,
                  allowNull: true
            },
            bmi:{ /*Indice de masa corporal*/
                  type: DataTypes.FLOAT,
                  allowNull: true
            },
            training_days:{ /*Días de entrenamiento */
                  type: DataTypes.STRING,
                  allowNull: true
            },
            height:{
                  type: DataTypes.FLOAT,
                  allowNull: true
            },
            weight:{
                  type: DataTypes.FLOAT,
                  allowNull : true
            },
            nro_acount:{
                  type:DataTypes.STRING,
                  allowNull: true
            }
            /*Se añadirá una columna para las transacciones */
      })
};

module.exports = User;
