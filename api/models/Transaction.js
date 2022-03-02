const { DataTypes } = require("sequelize");

const Transaction = (sequelize) => {
      sequelize.define('Transaction', {
            id: {
                  type: DataTypes.UUID,
                  defaultValue: DataTypes.UUIDV4,
                  primaryKey: true
            },
            productId: {
                  type: DataTypes.STRING,
                  allowNull: false
            },
            amount: {
                  type: DataTypes.FLOAT,
                  allowNull: false
            },
            method: {
                  type: DataTypes.JSON,
                  allowNull: false
            },
            receipt:{
                  type: DataTypes.TEXT,
                  allowNull: false
            }
      });
};

module.exports = Transaction;
