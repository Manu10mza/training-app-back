const { DataTypes } = require("sequelize");

const ProductClients = (sequelize) => {
      sequelize.define('ProductClients', {
            id: {
                  type: DataTypes.UUID,
                  defaultValue: DataTypes.UUIDV4,
                  primaryKey: true
            },
            productId: {
                type: DataTypes.STRING,
                allowNull: false
            },
            clientsData: {
                  type: DataTypes.ARRAY(DataTypes.JSON),
            }
      });
};

module.exports = ProductClients;