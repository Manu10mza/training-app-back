const { DataTypes } = require("sequelize");

const Transactions = (sequelize)=>{
      sequelize.define('Transaction',{
            id:{
                  type: DataTypes.UUID,
                  defaultValue: DataTypes.UUIDV4,
                  primaryKey:true
            },
            amount:{
                  type: DataTypes.FLOAT,
                  allowNull : false
            },
            isSell: {
                  type: DataTypes.BOOLEAN,
                  allowNull: true
            },
            isSold:{
                  type: DataTypes.BOOLEAN,
                  allowNull: true

            },
            product: {
                  type: DataTypes.JSON,
                  allowNull: false
            }
      })
}

module.exports = Transactions;