const { DataTypes } = require("sequelize");

const Exercise = (sequelize)=>{
      sequelize.define('Exercise',{
            id:{
                  type: DataTypes.UUID,
                  defaultValue: DataTypes.UUIDV4,
                  primaryKey:true
            },
            title:{
                  type: DataTypes.STRING,
                  allowNull: false
            },
            description:{
                  type: DataTypes.TEXT,
                  allowNull: false
            },
            video:{
                  type: DataTypes.STRING,
                  allowNull: false
            }
      })
}

module.exports = Exercise;