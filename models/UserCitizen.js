import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';

export default (sequelize) => {
  class UserCitizen extends Model {
    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
    static associate(models) {
      UserCitizen.hasMany(models.Infraction, { foreignKey: 'citoyenId', as: 'infractions' });
    }
  }
  UserCitizen.init({
    cni: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nom_complet: {
      type: DataTypes.STRING,
      allowNull: false
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'UserCitizen',
    tableName: 'users_citizen',
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
      }
    }
  });
  return UserCitizen;
};