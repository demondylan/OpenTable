const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Favorite, Reservation, User, sequelize, Review, Restaurant, Openinghour } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const sequelized = require("sequelize");
const { Op } = require("sequelize")
const router = express.Router();
const moment = require("moment-timezone");

const validateRestaurant = [
  check("address").exists().withMessage("Street address is required"),
  check("city").exists().withMessage("City is required"),
  check("state").exists().withMessage("State is required"),
  check("zip_code").exists().withMessage("Zip code is required"),
  check("name")
    .exists()
    .isLength({ max: 49 })
    .withMessage("Name must be less than 50 characters"),
  check("description").exists().withMessage("Description is required"),
  handleValidationErrors,
];
router.get('/server-time', (req, res) => {
  const serverTime = new Date();
  res.json({ serverTime });
});
// GET all restaurants with pagination
router.get("/", async (req, res, next) => {
  let { page, size } = req.query;
  page = parseInt(page) || 1;
  size = parseInt(size) || 20;

  if (page <= 0 || size <= 0) {
    return res.status(400).json({
      message: "Validation Error",
      statusCode: 400,
      errors: {
        page: "Page and size must be greater than 0",
      },
    });
  }

  try {
    const restaurants = await Restaurant.findAll({
      include: [
        { model: Review },
        { model: Reservation },
        { model: Openinghour }
      ],
      limit: size,
      offset: (page - 1) * size,
    });

    return res.json(restaurants);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET reviews for a specific restaurant
router.get("/:restaurantId/reviews", async (req, res, next) => {
  const restaurantId = req.params.restaurantId;

  try {
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res
        .status(404)
        .json({ message: "Restaurant couldn't be found", status: 404 });
    }

    const reviews = await Review.findAll({
      where: { restaurant_id: restaurantId },
      include: [{ model: User, attributes: ["id", "firstName", "lastName"] },
      { model: Restaurant}],
    });

    return res.json(reviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET reservations for a specific restaurant
router.get("/:restaurantId/reservations", async (req, res, next) => {
  const restaurantId = req.params.restaurantId;

  try {
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res
        .status(404)
        .json({ message: "Restaurant couldn't be found", status: 404 });
    }

    const reservations = await Reservation.findAll({
      where: { restaurant_id: restaurantId },
      include: [{ model: User, attributes: ["id", "firstName", "lastName"] }],
    });

    return res.json(reservations);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET current user's restaurants
router.get("/current", requireAuth, async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      where: { owner_id: req.user.id },
      include: [
        { model: Review },
        { model: Reservation },
        { model: Openinghour },
      ],
    });

    return res.json({ restaurants });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET restaurants based on search query, date, time, and seats
router.get("/search-results", async (req, res, next) => {
  const { query, date, time, seats } = req.query;

  try {
    const restaurants = await Restaurant.findAll({
      where: {
        name: {
          [Op.iLike]: `%${query}%`,
        },
      },
      include: [
        {
          model: Openinghour,
          where: { day: new Date().getDay() },
          required: true,
        },
        {
          model: Reservation,
          where: {
            date,
            seats: { [Op.gte]: seats },
          },
          required: false,
        },
      ],
    });

    const filteredRestaurants = restaurants.filter((restaurant) => {
      const openingHours = restaurant.Openinghours[0];
      if (!openingHours) {
        return false;
      }

      const restaurantTimezone = restaurant.time_zone; // Get the restaurant's time zone from the model
      const searchTime = moment.tz(time, restaurantTimezone).format("HH:mm:ss");

      return (
        openingHours.open <= searchTime &&
        openingHours.close >= searchTime
      );
    });

    return res.json(filteredRestaurants);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET a specific restaurant
router.get("/:restaurantId", async (req, res, next) => {
  const restaurantId = req.params.restaurantId;

  try {
    const restaurant = await Restaurant.findOne({
      where: { id: restaurantId },
      include: [
        { model: Review },
        { model: User },
        { model: Openinghour },
      ],
    });

    if (!restaurant) {
      return res
        .status(404)
        .json({ message: "Restaurant couldn't be found", status: 404 });
    }

    return res.json(restaurant);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE a restaurant
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

// CREATE a new restaurant
router.post("/", requireAuth, validateRestaurant, async (req, res, next) => {
  const { address, city, zip_code, description, name, phone, state, logo, food_type, lat, lng, OpeningHours } = req.body;

  try {
    const newRestaurant = await Restaurant.create({
      owner_id: req.user.id,
      address,
      city,
      zip_code,
      description,
      name,
      phone,
      state,
      logo,
      food_type,
      lat,
      lng,
    });

    // Create the OpeningHours records
    if (OpeningHours && Array.isArray(OpeningHours)) {
      for (const openingHour of OpeningHours) {
        await Openinghour.create({
          restaurant_id: newRestaurant.id,
          day: openingHour.day,
          open: openingHour.open,
          close: openingHour.close,
        });
      }
    }

    return res.json(newRestaurant);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// CREATE a new review for a restaurant
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


// CREATE a new reservation for a restaurant
router.post("/:restaurantId/reservations", requireAuth, async (req, res, next) => {
  const restaurantId = req.params.restaurantId;
  const { time, date, seats } = req.body;

  try {
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res
        .status(404)
        .json({ message: "Restaurant couldn't be found", status: 404 });
    }

    const existingReservation = await Reservation.findOne({ where: { user_id: req.user.id, restaurant_id: restaurantId } });
    if (existingReservation) {
      return res.status(403).json({ message: "Reservation already exists", status: 403 });
    }

    const newReservation = await Reservation.create({
      user_id: req.user.id,
      restaurant_id: restaurantId,
      time,
      date,
      seats,
    });

    return res.json(newReservation);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE a restaurant
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
