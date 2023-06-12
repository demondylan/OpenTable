'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Restaurant.hasMany(models.Reservation, {
        foreignKey: "restaurant_id"
      })
      Restaurant.hasMany(models.Review, {
        foreignKey: "restaurant_id"
      })
      Restaurant.hasMany(models.Favorite, {
        foreignKey: "restaurant_id"
      })
      Restaurant.belongsTo(models.User, {
        foreignKey: "owner_id"
      })
    }
  }
  Restaurant.init({
    owner_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip_code: DataTypes.STRING,
    open: DataTypes.TIME,
    close: DataTypes.TIME,
    phone: DataTypes.STRING,
    food_type: DataTypes.STRING,
    description: DataTypes.STRING,
    logo: DataTypes.STRING,
    lat: {
      type: DataTypes.FLOAT,
    },
    lng: {
      type: DataTypes.FLOAT,
    },
    rating: DataTypes.DECIMAL(10,1)
  }, {
    sequelize,
    modelName: 'Restaurant',
  });
  return Restaurant;
};