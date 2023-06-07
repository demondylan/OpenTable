'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Favorites';
    await queryInterface.bulkInsert(options, [
      {
        user_id: 1,
        restaurant_id: 2
      },
      {
        user_id: 2,
        restaurant_id: 3
      },
      {
        user_id: 3,
        restaurant_id: 1
      }

    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = "Favorites"
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {})
  }
};