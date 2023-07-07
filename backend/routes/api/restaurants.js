const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Favorite, Reservation, User, sequelize, Review, Restaurant } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const sequelized = require("sequelize");
const { Op } = require("sequelize")
const router = express.Router();



const validateRestaurant = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('zip_code')
    .exists({ checkFalsy: true })
    .withMessage('Zip code is required'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 49 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  handleValidationErrors
];

router.get('/', async (req, res, next) => {
    let { page, size } = req.query
    if (page <= 0) {
      res.status(400)
      return res.json({
        message: "Validation Error",
        statusCode: 400,
        errors: {
          page: "Page must be greater than or equal to 1"
        }
      })
    }
    if (size <= 0) {
      res.status(400)
      return res.json({
        message: "Validation Error",
        statusCode: 400,
        errors: {
          page: "Size must be greater than or equal to 1"
        }
      })
    }

    if (!page || isNaN(page) || page > 10) { page = 1 }
    if (!size || isNaN(size) || size > 20) { size = 20 }
    page = Number(page)
    size = Number(size)
    const restaurants = await Restaurant.findAll({
      include: [
            { model: Review },
            { model: Reservation }
    ],
      limit: size,
      offset: (page - 1) * size,
    })
      page = parseInt(page)
      size = parseInt(size)
    res.json(restaurants)
  })


  router.get('/:restaurantsid/reviews', async (req, res, next) => {
    const id = req.params.restaurantsid;
    const restaurants = await Restaurant.findByPk(id)
    if (!restaurants) {
      res.status(404).json({ message: "Restaurant couldn't be found", status: 404 })
    }
    const reviews = await Review.findAll({
      where: {
        restaurant_id: id
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
          subQuery: false,
        },
      ]
  
    })
    return res.json(reviews)
  })
  router.get('/:restaurantsidForReservation/reservations', async (req, res, next) => {
    const id = req.params.restaurantsidForReservation;
    const restaurants = await Restaurant.findByPk(id)
    if (!restaurants) {
      res.status(404).json({ message: "Restaurant couldn't be found", status: 404 })
    }
    const reservations = await Reservation.findAll({
      where: {
        restaurant_id: id
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
          subQuery: false,
        },
      ]
  
    })
    return res.json(reservations)
  })
  
  router.get('/current', requireAuth, async (req, res) => {
  
    const restaurants = await Restaurant.findAll({
      where: {
        owner_id: req.user.id
      }
    })
    for await (let restaurant of restaurants) {
      const reviews = await Review.findAll({
        where: { restaurant_id: restaurant.id }
      })
    }
    res.json({ Restaurants: restaurants })
  })
  router.get('/search-results', async (req, res, next) => {
    const { query, date, time, seats } = req.query;
  
    // Handle the search results based on the provided parameters
    // Use the query, date, time, and seats values to query your data source (e.g., database)
    // Return the matching search results as a response
    
    try {
      const restaurants = await Restaurant.findAll({
        where: {
          name: {
            [Op.iLike]: `%${query}%` // Use case-insensitive search for restaurant name
          },
          open: {
            [Op.lte]: time // Filter restaurants that are open at the specified time
          }
        },
        include: {
          model: Reservation,
          where: {
            date,
            seats: {
              [Op.gte]: seats // Filter reservations with available seats
            }
          },
          required: false // Include restaurants even if they have no reservations
        }
      });
  
      return res.json(restaurants);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  router.get('/:restaurantsid', async (req, res, next) => {
    const id = req.params.restaurantsid;
    const restaurants = await Restaurant.findOne({
      where:{
          id: id
      },
      include:[
          {model: Review},
          {model: User}
      ]
  });
    if (!restaurants) {
      res.status(404).json({ message: "Restaurant couldn't be found", status: 404 })
    }
    return res.json(restaurants)
  })
  
  
  router.delete('/:restaurantsId', requireAuth, async (req, res) => {
    const restaurants = await Restaurant.findByPk(req.params.restaurantsId)
    if (!restaurants) {
      res.status(404).json({ message: "Restaurant couldn't be found", status: 404 })
    }
    if(restaurants.owner_id === req.user.id){
    await restaurants.destroy()
    return res.json(restaurants)
  } else {
    res.status(401).json({ message: "You must be the owner to delete the restaurant", status: 401 })
  }
  })
  
  router.post('/', requireAuth, validateRestaurant, async (req, res, next) => {
    const { address, city, zip_code, description, open, close, name, phone, state, logo, food_type, lat, lng } = req.body
    // console.log(user)
  
    const newRestaurant = await Restaurant.create({
      owner_id: req.user.id, address, city, zip_code, description, open, close, name, phone, state, logo, food_type, lat, lng
    })
    return res.json(newRestaurant)
  
  })
  router.post('/:restaurantid/reviews', requireAuth, async (req, res, next) => {
    const id = req.params.restaurantid;
    const restaurants = await Restaurant.findByPk(id)
    if (restaurants === null) {
      res.status(404).json({ message: "Restaurant couldn't be found", status: 404 })
    }
  
    const reviews = await Review.findAll({ where: { [Op.and]: [{ user_id: req.user.id }, { restaurant_id: id }] } })
    if (reviews.length > 0) {
      res.status(403).json({ message: "Review exists", status: 403 })
    } else {
  
    const { message, ambience_rating, service_rating, food_rating, value_rating} = req.body

    const newReview = await Review.create({
    user_id: req.user.id,
    restaurant_id: Number(req.params.restaurantid),
    message: message,
    value_rating: value_rating,
    food_rating: food_rating,
    ambience_rating: ambience_rating,
    service_rating: service_rating,
    })
  
    return res.json(newReview)
    }
  })
  
  router.post('/:restaurantidForReservation/reservations', requireAuth, async (req, res, next) => {
    const id = req.params.restaurantidForBooking;

    const { user_id, restaurant_id, time, date, seats } = req.body
    const restaurants = await Restaurant.findByPk(id)
    if (restaurants === null) {
      res.status(404).json({ message: "Restaurant couldn't be found", status: 404 })
    }
  
    const reservations = await Reservation.findOne({ where: { userid: req.user.id } });
    if (reservations != null) {
      res.status(403).json({ message: "Reservation exists", status: 403 })
  
    }
  
    const newReservation = await Reservation.create({
    user_id: req.user.id,
    restaurant_id: id,
    time,
    date,
    seats
    })
  
    return res.json(newReservation)
  
  })
  
  
  router.put('/:restaurantsid', requireAuth, async (req, res, next) => {
    const id = req.params.restaurantsid;
    const restaurants = await Restaurant.findByPk(id)
    if (!restaurants) {
      res.status(404).json({ message: "Restaurant couldn't be found", status: 404 })
    }

    await restaurants.update({
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zip_code: req.body.zip_code,
      open: req.body.open,
      close: req.body.close,
      phone: req.body.phone,
      name: req.body.name,
      food_type: req.body.food_type,
      description: req.body.description,
      logo: req.body.logo,
      rating: req.body.rating,
      food_type_id: req.body.food_type,
      createdAt: sequelized.literal("CURRENT_TIMESTAMP"),
      updatedAt: sequelized.literal("CURRENT_TIMESTAMP")
    });
  
    await restaurants.save
    return res.json(restaurants)
  
  });

  module.exports = router;