'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Comment, { foreignKey: 'userId' })

      // associate to the Favorite table
      User.belongsToMany(models.Restaurant, {
        through: models.Favorite,
        foreignKey: 'userId',
        as: 'FavoritedRestaurants'
      })

      // associate to the Like table
      User.belongsToMany(models.Restaurant, {
        through: models.Like,
        foreignKey: 'userId',
        as: 'LikedRestaurants'
      })

      // notice 下面兩個為自關聯，因此需要仔細思考個別的意義
      // associate to the following（誰追蹤這個使用者） table
      // note 找出誰在追蹤這個使用者，因此外鍵用following, 並名為追蹤該名使用者的追蹤者們
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers'
      })

      // associate the follower （這個使用者追蹤了誰）table
      // note 找出使用者追蹤了誰，因此外鍵用follower, 並命名為使用者追蹤了哪些人們
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings'
      })
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
      image: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      // note underscored 可以讓JS這邊使用駝峰命名，但是到了資料庫自動變成snake-case
      underscored: true
    }
  );
  return User;
};
