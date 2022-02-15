import { DataTypes } from "sequelize/types";


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
            owner:{
                  type: DataTypes.UUIDV4,
                  allowNull: false
            },
            days:{ /*Esquema de los días con sus ejercicios en formato .JSON */
                  type: DataTypes.JSON,
                  allowNull: false
            }
      });
}

export default Rutines;