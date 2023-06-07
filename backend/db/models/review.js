'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.User, {
        foreignKey: "user_id"
      })
      Review.belongsTo(models.Restaurant, {
        foreignKey: "restaurant_id"
      })
    }
  }
  Review.init({
    user_id: DataTypes.INTEGER,
    restaurant_id: DataTypes.INTEGER,
    value_rating: DataTypes.INTEGER,
    food_rating: DataTypes.INTEGER,
    service_rating: DataTypes.INTEGER,
    ambience_rating: DataTypes.INTEGER,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};