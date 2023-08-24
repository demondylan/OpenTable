const { sequelize } = require("../models");
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("Openinghours", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      restaurant_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Restaurants',
          key: 'id',
          onDelete: 'CASCADE'
        }
      },
      day: {
        allowNull: false,
        type: Sequelize.STRING
      },
      open: {
        allowNull: false,
        type: Sequelize.TIME
      },
      close: {
        allowNull: false,
        type: Sequelize.TIME
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = "Openinghours";
    return queryInterface.dropTable(options);
  }
};
