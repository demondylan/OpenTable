'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Restaurants';
    return queryInterface.bulkInsert(options, [
      {
        owner_id: 1,
        name: "Khom Fai",
        address: "48856 Romeo Plank Rd",
        rating: "5",
        city: "Macomb",
        state: "Michigan",
        zip_code: "48044",
        phone: "586-247-7773",
        open: "15:00",
        close: "22:00",
        food_type: "Thai",
        description: "Located in the suburbs of Detroit, Michigan, Khom Fai is the creation of brothers Chef Isaiah Sonjeow and Chris Sonjeow",
        logo: "http://images.squarespace-cdn.com/content/v1/5e7a55e783756d180929bd51/1585246683200-DMVEMXIP7OWF94RV8N78/KF_Logo_Horz_color.jpg"
      },
      {
        owner_id: 2,
        name: "Nicks 22nd Street",
        address: "48900 Van Dyke Ave",
        rating: "5",
        city: "Shelby Township",
        state: "Michigan",
        zip_code: "48317",
        phone: "586-731-3900",
        open: "15:00",
        close: "22:00",
        food_type: "italian",
        description: "Steakhouse 22 in Shelby Township, formally Nick's Steakhouse is Macomb County and Metro Detroit's premier family steakhouse.",
        logo: "http://static.wixstatic.com/media/7ef304_85a71a3b1bc4472595644355352b1477~mv2.jpg/v1/fill/w_476,h_374,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/73268400_2863876476965265_23988000429629.jpg"
      },
      {
        owner_id: 3,
        name: "Smash Burger",
        address: "1735 E Big Beaver Rd",
        rating: "5",
        city: "Troy",
        state: "Michigan",
        zip_code: "48083",
        phone: "248-524-0420",
        open: "15:00",
        close: "22:00",
        food_type: "Fast Food",
        description: "Counter-serve chain featuring signature smashed burgers, plus sides & shakes.",
        logo: "http://dynl.mktgcdn.com/p/KpjRXAxvbz4OeBEkDiZ4jdbPmTUAM6OZUchpVTUdfXY/1910x660.png"
      }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Restaurants';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Khom Fai', 'Nicks 22nd Street', 'Smash Burger'] }
    }, {});
  }
};