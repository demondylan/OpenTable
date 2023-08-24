'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    static associate(models) {
      Restaurant.hasMany(models.Reservation, {
        foreignKey: 'restaurant_id'
      });
      Restaurant.hasMany(models.Review, {
        foreignKey: 'restaurant_id'
      });
      Restaurant.hasMany(models.Favorite, {
        foreignKey: 'restaurant_id'
      });
      Restaurant.belongsTo(models.User, {
        foreignKey: 'owner_id'
      });
      Restaurant.hasMany(models.Openinghour, {
        foreignKey: 'restaurant_id',
      });
    }
  }

  Restaurant.init(
    {
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 50] // Restrict the name length between 1 and 50 characters
        }
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      zip_code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      max_seats: DataTypes.INTEGER,
      phone: DataTypes.STRING,
      food_type: DataTypes.STRING,
      description: DataTypes.STRING,
      logo: DataTypes.STRING,
      lat: {
        type: DataTypes.FLOAT
      },
      lng: {
        type: DataTypes.FLOAT
      },
      time_zone: {
        allowNull: false,
        type: DataTypes.STRING, // Store the time zone as a string
      },
      rating: DataTypes.DECIMAL
    },
    {
      sequelize,
      modelName: 'Restaurant',
      indexes: [
        {
          fields: ['name']
        }
      ]
    }
  );

  return Restaurant;
};
