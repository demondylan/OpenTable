'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.User, {
        foreignKey: 'user_id'
      });
      Review.belongsTo(models.Restaurant, {
        foreignKey: 'restaurant_id'
      });
    }
  }

  Review.init(
    {
      user_id: DataTypes.INTEGER,
      restaurant_id: DataTypes.INTEGER,
      value_rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: 'Value rating must be at least 1.'
          },
          max: {
            args: [5],
            msg: 'Value rating cannot exceed 5.'
          }
        }
      },
      food_rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: 'Food rating must be at least 1.'
          },
          max: {
            args: [5],
            msg: 'Food rating cannot exceed 5.'
          }
        }
      },
      service_rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: 'Service rating must be at least 1.'
          },
          max: {
            args: [5],
            msg: 'Service rating cannot exceed 5.'
          }
        }
      },
      ambience_rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: 'Ambience rating must be at least 1.'
          },
          max: {
            args: [5],
            msg: 'Ambience rating cannot exceed 5.'
          }
        }
      },
      message: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Review'
    }
  );

  return Review;
};