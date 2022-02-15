import { DataTypes } from "sequelize/types";


const User = (sequelize) => {
      sequelize.define('User', {
            id: {
                  type: DataTypes.UUID,
                  defaultValue: DataTypes.UUIDV4,
                  primaryKey: true
            },
            email: {
                  type: DataTypes.STRING,
                  allowNull: false
            },
            password: {
                  type: DataTypes.STRING,
                  allowNull: false
            },
            profile_img: {
                  type: DataTypes.STRING,
                  allowNull: true
            },
            is_nutricionist: {
                  type: DataTypes.BOOLEAN,
                  allowNull: true
            },
            is_trainer: {
                  type: DataTypes.BOOLEAN,
                  allowNull: true
            },
            bmi: { /*Indice de masa corporal*/
                  type: DataTypes.INTEGER,
                  allowNull: true
            },
            training_days: { /*Días de entrenamiento */
                  type: DataTypes.INTEGER,
                  allowNull: true
            },
            height: {
                  type: DataTypes.FLOAT,
                  allowNull: true
            },
            weight: {
                  type: DataTypes.FLOAT,
                  allowNull: true
            },
            /*Se añdrá una columna que para las transacciones */
      });
};

export default User;
