import { DataTypes } from "sequelize/types";


const Recipe = (sequelize) => {
      sequelize.define('Recipe', {
            id: {
                  type: DataTypes.UUID,
                  defaultValue: DataTypes.UUIDV4,
                  primaryKey: true
            },
            title: {
                  type: DataTypes.STRING,
                  allowNull: false
            },
            kcal: { /*Calorias x Kilo */
                  type: DataTypes.FLOAT,
                  allowNull: true
            },
            carbohydrates: {
                  type: DataTypes.FLOAT,
                  allowNull: true
            },
            fat: {
                  type: DataTypes.FLOAT,
                  allowNull: true
            },
            proteins: {
                  type: DataTypes.FLOAT,
                  allowNull: true
            },
            grams: {  /*Gramos recomendados por plato/porcion */
                  type: DataTypes.FLOAT,
                  allowNull: true
            },
            description: {
                  type: DataTypes.TEXT,
                  allowNull: true
            }
      });
};

export default Recipe;