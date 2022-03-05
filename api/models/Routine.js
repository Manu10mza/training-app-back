const { DataTypes } = require("sequelize");

const Routine = (sequelize) => {
  sequelize.define("Routine", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
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
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });
};

module.exports = Routine;
