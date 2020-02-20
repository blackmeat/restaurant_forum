'use strict';
module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define('Restaurant', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    tel: DataTypes.STRING,
    opening_hours: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER,
    viewCounts: DataTypes.INTEGER
  }, {});
  Restaurant.associate = function (models) {
    Restaurant.belongsTo(models.Category)
    Restaurant.hasMany(models.Comment)
    Restaurant.belongsToMany(models.User, {
      through: models.Favorite,
      foreignKey: "RestaurantId",
      as: "FavoriteUsers"
    })
    Restaurant.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: "RestaurantId",
      as: "LikeUsers"
    })
    // associations can be defined here
  };
  return Restaurant;
};