const { DataTypes } = require("sequelize");

const User = (sequelize) => {
  sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_nutritionist: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    is_personal_trainer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    training_days: {
      /*Días de entrenamiento */ type: DataTypes.INTEGER,
      allowNull: true,
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    nro_acount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    /*Se añadirá una columna para las transacciones */
  });
};

module.exports = User;