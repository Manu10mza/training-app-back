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
            isNutritionist:{
                  type: DataTypes.BOOLEAN,
                  allowNull: true
            },
            isPersonalTraining:{
                  type: DataTypes.BOOLEAN,
                  allowNull: true
            },
            imc:{ /*Indice de masa corporal*/
                  type: DataTypes.INTEGER,
                  allowNull: true
            },
            total_day:{ /*Días de entrenamiento */
                  type: DataTypes.INTEGER,
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

            /*Se añdrá una columna que para las transacciones */
      })
};

module.exports = User;
