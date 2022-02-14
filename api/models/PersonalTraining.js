const {DataTypes} = require('sequelize');

const PersonalTrainer = (sequelize) =>{
      sequelize.define('PersonalTrainer',{
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
            }
      })
}

module.exports = PersonalTrainer;