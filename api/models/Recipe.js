const {DataTypes} = require('sequelize');

const Recipe = (sequelize) =>{
      sequelize.define('Recipe', {
            id:{
                  type: DataTypes.UUID,
                  defaultValue: DataTypes.UUIDV4,
                  primaryKey:true
            },
            title:{
                  type: DataTypes.STRING,
                  allowNull: false
            },
            kcal:{
                  type: DataTypes.FLOAT,
                  allowNull: true
            },
            carbohydrates:{
                  type: DataTypes.FLOAT,
                  allowNull: true
            },
            grease:{
                  type: DataTypes.FLOAT,
                  allowNull: true
            },
            proteins:{
                  type: DataTypes.FLOAT,
                  allowNull: true
            },
            grs:{
                  type: DataTypes.FLOAT,
                  allowNull: true
            },
            description:{
                  type: DataTypes.TEXT,
                  allowNull: true
            }
      });
}

module.exports = Recipe;