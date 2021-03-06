'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    image: DataTypes.STRING
  }, {});
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.Comment)
    User.belongsToMany(models.Restaurant, {
      through: models.Favorite,
      foreignKey: "UserId",
      as: "FavoriteRestaurants"
    })
    User.belongsToMany(models.Restaurant, {
      through: models.Like,
      foreignKey: "UserId",
      as: "LikeRestaurants"
    })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: "followerId",
      as: "Followeds"
    })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: "followedId",
      as: "Followers"
    })
  };
  return User;
};