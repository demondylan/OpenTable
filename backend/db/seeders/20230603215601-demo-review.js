'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        user_id: 1,
        restaurant_id: 1,
        value_rating: 4,
        food_rating: 3,
        service_rating: 2,
        ambience_rating: 3,
        message: 'they are alright'
      },
      {
        user_id: 2,
        restaurant_id: 2,
        value_rating: 5,
        food_rating: 5,
        service_rating: 5,
        ambience_rating: 5,
        message: 'they are great'
      },
      {
        user_id: 3,
        restaurant_id: 3,
        value_rating: 5,
        food_rating: 5,
        service_rating: 5,
        ambience_rating: 5,
        message: 'they are terrible'
      }, {
        user_id: 1,
        restaurant_id: 2,
        value_rating: 5,
        food_rating: 5,
        service_rating: 5,
        ambience_rating: 5,
        message: 'they are good'
      }, {
        user_id: 2,
        restaurant_id: 3,
        value_rating: 5,
        food_rating: 5,
        service_rating: 5,
        ambience_rating: 5,
        message: 'they are excellent'
      },
      {
        user_id: 3,
        restaurant_id: 1,
        value_rating: 5,
        food_rating: 5,
        service_rating: 5,
        ambience_rating: 5,
        message: 'they are amazing'
      }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {})
  }
};