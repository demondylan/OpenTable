'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Openinghours';
    await queryInterface.bulkInsert(options, [
      {
        restaurant_id: 1,
        day: 'Monday',
        open: '01:30',
        close: '21:30',
      },
      {
        restaurant_id: 1,
        day: 'Tuesday',
                open: '01:30',
        close: '21:30',
      },
      {
        restaurant_id: 1,
        day: 'Wednesday',
                open: '01:30',
        close: '21:30',
      },
      {
        restaurant_id: 1,
        day: 'Thursday',
                open: '01:30',
        close: '21:30',
      },
      {
        restaurant_id: 1,
        day: 'Friday',
                open: '01:30',
        close: '21:30',
      },
      {
        restaurant_id: 1,
        day: 'Saturday',
                open: '01:30',
        close: '21:30',
      },
      {
        restaurant_id: 1,
        day: 'Sunday',
                open: '01:30',
        close: '21:30',
      },
      // Restaurant 2
      {
        restaurant_id: 2,
        day: 'Monday',
                open: '01:30',
        close: '21:30',
      },
      {
        restaurant_id: 2,
        day: 'Tuesday',
                open: '01:30',
        close: '21:30',
      },
      {
        restaurant_id: 2,
        day: 'Wednesday',
                open: '01:30',
        close: '21:30',
      },
      {
        restaurant_id: 2,
        day: 'Thursday',
                open: '01:30',
        close: '21:30',
      },
      {
        restaurant_id: 2,
        day: 'Friday',
                open: '01:30',
        close: '21:30',
      },
      {
        restaurant_id: 2,
        day: 'Saturday',
                open: '01:30',
        close: '21:30',
      },
      {
        restaurant_id: 2,
        day: 'Sunday',
                open: '01:30',
        close: '21:30',
      },
      // Restaurant 3
      {
        restaurant_id: 3,
        day: 'Monday',
                open: '01:30',
        close: '21:30',
      },
      {
        restaurant_id: 3,
        day: 'Tuesday',
                open: '01:30',
        close: '21:30',
      },
      {
        restaurant_id: 3,
        day: 'Wednesday',
                open: '01:30',
        close: '21:30',
      },
      {
        restaurant_id: 3,
        day: 'Thursday',
                open: '01:30',
        close: '21:30',
      },
      {
        restaurant_id: 3,
        day: 'Friday',
                open: '01:30',
        close: '21:30',
      },
      {
        restaurant_id: 3,
        day: 'Saturday',
                open: '01:30',
        close: '21:30',
      },
      {
        restaurant_id: 3,
        day: 'Sunday',
                open: '01:30',
        close: '21:30',
      },

    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = "Openinghours"
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {})
  }
};