'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {

    static associate(models) {
      Restaurant.belongsTo(models.Category, {foreignKey: { name: 'CategoryId' }})
      Restaurant.hasMany(models.Comment)
    }
  };
  Restaurant.init({
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    address: DataTypes.STRING,
    opening_hours: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Restaurant',
  });
  return Restaurant;
};