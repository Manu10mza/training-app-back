import { DataTypes } from "sequelize/types";


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
            isSell: {
                  type: DataTypes.BOOLEAN,
                  allowNull: true
            },
            isSold: {
                  type: DataTypes.BOOLEAN,
                  allowNull: true

            },
            diet: {
                  type: DataTypes.UUIDV4,
                  allowNull: true
            },
            rutine: {
                  type: DataTypes.UUIDV4,
                  allowNull: true
            }
      });
};


export default Transaction;