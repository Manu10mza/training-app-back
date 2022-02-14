const {DataTypes} = require('sequelize');

const Rutines = (sequelize) =>{
      sequelize.define('Rutines',{
            id:{
                  type: DataTypes.UUID,
                  defaultValue: DataTypes.UUIDV4,
                  primaryKey:true
            },
            title:{
                  type: DataTypes.STRING,
                  allowNull: false
            },
            days:{
                  type: DataTypes.JSON,
                  allowNull: false
            }
      });
}

module.exports = Rutines;