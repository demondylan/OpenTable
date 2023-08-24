'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    static associate(models) {
      Reservation.belongsTo(models.User, {
        foreignKey: 'user_id'
      });
      Reservation.belongsTo(models.Restaurant, {
        foreignKey: 'restaurant_id'
      });
    }
  }

  Reservation.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      restaurant_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      seats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: 'Number of seats must be at least 1.'
          }
        }
      }
    },
    {
      sequelize,
      modelName: 'Reservation'
    }
  );

  return Reservation;
};
