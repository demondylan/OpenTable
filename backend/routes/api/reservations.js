const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { Reservation, User, Restaurant } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// Get current user's reservations
router.get('/current', requireAuth, async (req, res) => {
  const reservations = await Reservation.findAll({
    where: {
      user_id: req.user.id
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"]
      },
      {
        model: Restaurant,
        attributes: ["id", "owner_id", "address", "city", "state", "zip_code", "open", "close", "name", "phone", "food_type", "logo"]
      }
    ]
  });

  res.json({ reservations });
});

// Delete a reservation
router.delete('/:reservationId', async (req, res) => {
  const reservation = await Reservation.findByPk(req.params.reservationId);
  if (!reservation) {
    res.status(404).json({ message: "Reservation couldn't be found", status: 404 });
    return;
  }

  if (reservation.user_id === req.user.id) {
    await reservation.destroy();
    res.json(reservation);
  } else {
    res.status(401).json({ message: "Must be the owner to delete the reservation", status: 404 });
  }
});

// Update a reservation
router.put('/:reservationId', requireAuth, async (req, res) => {
  const reservation = await Reservation.findByPk(req.params.reservationId);
  if (!reservation) {
    res.status(404).json({ message: "Reservation couldn't be found", status: 404 });
    return;
  }

  reservation.time = req.body.time;
  reservation.date = req.body.date;
  reservation.seats = req.body.seats;
  reservation.updatedAt = sequelize.literal("CURRENT_TIMESTAMP");

  await reservation.save();
  res.json(reservation);
});

// Get reservations for a restaurant
router.get('/:restaurantId/reservations', async (req, res) => {
  const restaurantId = req.params.restaurantId;

  const reservations = await Reservation.findAll({
    where: {
      restaurant_id: restaurantId
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"]
      },
      {
        model: Restaurant,
        attributes: ["id", "owner_id", "address", "city", "state", "zip_code", "open", "close", "name", "phone", "food_type", "logo"]
      }
    ]
  });

  res.json({ reservations });
});

module.exports = router;
