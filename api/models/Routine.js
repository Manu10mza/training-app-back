import { DataTypes } from "sequelize/types";


const Routine = (sequelize) => {
      sequelize.define('Routine', {
            id: {
                  type: DataTypes.UUID,
                  defaultValue: DataTypes.UUIDV4,
                  primaryKey: true
            },
            title: {
                  type: DataTypes.STRING,
                  allowNull: false
            },
            owner: {
                  type: DataTypes.UUIDV4,
                  allowNull: false
            },
            days: { /*Esquema de los días con sus ejercicios en formato .JSON */
                  type: DataTypes.JSON,
                  allowNull: false
            }
      });
};

export default Routine;