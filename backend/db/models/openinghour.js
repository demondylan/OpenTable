'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Openinghour extends Model {
    static associate(models) {
      Openinghour.belongsTo(models.Restaurant, {
        foreignKey: 'restaurant_id',
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
    }
  }

  Openinghour.init(
    {
      restaurant_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Restaurant',
          key: 'id',
          onDelete: 'CASCADE'
        }
      },
      day: {
        allowNull: false,
        type: DataTypes.STRING
      },
      open: {
        allowNull: false,
        type: DataTypes.TIME
      },
      close: {
        allowNull: false,
        type: DataTypes.TIME
      }
    },
    {
      sequelize,
      modelName: 'Openinghour'
    }
  );

  return Openinghour;
};
