const { DataTypes } = require("sequelize");

const Rutines = (sequelize) => {
  sequelize.define("Rutine", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    days: {
      /*Esquema de los días con sus ejercicios en formato .JSON */
      type: DataTypes.JSON,
      allowNull: false,
    },
  });
};

module.exports = Rutines;
