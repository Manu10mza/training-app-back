const { DataTypes } = require("sequelize");

const Diet = (sequelize) => {
    sequelize.define("Diet", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        owner: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        plain: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        disabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: true,
        },
    });
};

module.exports = Diet;
