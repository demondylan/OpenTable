'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Favorite.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
      Favorite.belongsTo(models.Restaurant, {
        foreignKey: "restaurant_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
    }
  }
  Favorite.init({
    user_id: DataTypes.INTEGER,
    restaurant_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Favorite',
  });
  return Favorite;
};