'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reservation.belongsTo(models.User, {
        foreignKey: "user_id"
      })
      Reservation.belongsTo(models.Restaurant, {
        foreignKey: "restaurant_id"
      })
    }
  }
  Reservation.init({
    user_id: DataTypes.INTEGER,
    restaurant_id: DataTypes.INTEGER,
    time: DataTypes.STRING,
    date: DataTypes.STRING,
    seats: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reservation',
  });
  return Reservation;
};