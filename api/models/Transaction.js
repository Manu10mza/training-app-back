const { DataTypes } = require("sequelize");

const Transaction = (sequelize) => {
      sequelize.define('Transaction', {
            id: {
                  type: DataTypes.UUID,
                  defaultValue: DataTypes.UUIDV4,
                  primaryKey: true
            },
            amount: {
                  type: DataTypes.FLOAT,
                  allowNull: false
            },
            isSold: {
                  type: DataTypes.BOOLEAN,
                  allowNull: true,
                  default : false
            },
            product: {
                  type: DataTypes.UUID,
                  allowNull: false,
            },
            bill:{
                  type: DataTypes.TEXT,
                  allowNull: true
            }
      });
};

module.exports = Transaction;
