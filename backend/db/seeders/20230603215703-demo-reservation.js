'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Reservations';
    await queryInterface.bulkInsert(options, [
      {
        user_id: 1,
        restaurant_id: 2,
        time: "19",
        date: "2023-07-02",
        seats: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: 2,
        restaurant_id: 3,
        time: "17",
        date: "2023-08-05",
        seats: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: 3,
        restaurant_id: 1,
        time: "15",
        date: "2023-07-08",
        seats: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = "Reservations";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {});
  }
};
