const { DataTypes } = require('sequelize');

const Client = (sequelize) =>{
      sequelize.define('Client',{
            id:{
                  type: DataTypes.UUID,
                  defaultValue: DataTypes.UUIDV4,
                  primaryKey:true
            },
            email:{
                  type: DataTypes.STRING,
                  allowNull: false
            },
            password:{
                  type: DataTypes.STRING,
                  allowNull: false
            },
            profileImg:{
                  type: DataTypes.STRING,
                  allowNull: true
            },
            imc:{
                  type: DataTypes.INTEGER,
                  allowNull: true
            },
            totalDay:{
                  type: DataTypes.INTEGER,
                  allowNull: true
            },
            height:{
                  type: DataTypes.FLOAT,
                  allowNull: true
            },
            weight:{
                  type: DataTypes.FLOAT,
                  allowNull : true
            }
      })
};

module.exports = Client;
