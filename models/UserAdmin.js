import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';

export default (sequelize) => {
  class UserAdmin extends Model {
    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
    static associate(models) {
      UserAdmin.hasMany(models.Infraction, { foreignKey: 'agentId', as: 'infractionsCrees' });
    }
  }
  UserAdmin.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('agent_verbalisateur', 'agent_controle', 'administrateur'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UserAdmin',
    tableName: 'users_admin',
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
      }
    }
  });
  return UserAdmin;
};