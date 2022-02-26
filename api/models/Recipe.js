const { DataTypes } = require("sequelize");

const Recipe = (sequelize) => {
    sequelize.define("Recipe", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        kcal: {
      /*Calorias x Kilo */ type: DataTypes.FLOAT,
            allowNull: true,
        },
        carbohydrates: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        grease: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        proteins: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        grs: {
      /*Gramos recomendados por plato/porcion */ type: DataTypes.FLOAT,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        instructions: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        disabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: true,
        },
    });
};

module.exports = Recipe;