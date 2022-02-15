import { DataTypes } from "sequelize/types";


const Diet = (sequelize) =>{
      sequelize.define('Diet',{
            id:{
                  type: DataTypes.UUID,
                  defaultValue: DataTypes.UUIDV4,
                  primaryKey:true
            },
            title:{
                  type: DataTypes.STRING,
                  allowNull: false
            },
            owner:{
                  type: DataTypes.UUIDV4,
                  allowNull : false
            },
            plain:{
                  type:DataTypes.JSON,
                  allowNull: false
            }
      })
}

export default Diet;