const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { Reservation, User, Restaurant } = require("../../db/models");
const { check, validationResult } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// Get current user's reservations
router.get('/current', requireAuth, async (req, res) => {
  try {
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
          attributes: [
            "id",
            "owner_id",
            "address",
            "city",
            "state",
            "zip_code",
            "Openinghours",
            "name",
            "phone",
            "food_type",
            "logo"
          ]
        }
      ]
    });

    res.json({ reservations });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", status: 500 });
  }
});

// Delete a reservation
router.delete('/:reservationId', requireAuth, async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found", status: 404 });
    }

    if (reservation.user_id !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized", status: 401 });
    }

    await reservation.destroy();
    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", status: 500 });
  }
});

// Update a reservation
router.put('/:reservationId', requireAuth, [
  check("time").notEmpty().withMessage("Time is required"),
  check("date").notEmpty().withMessage("Date is required"),
  check("seats").isInt({ min: 1 }).withMessage("Seats must be a positive integer")
], handleValidationErrors, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), status: 400 });
    }

    const reservation = await Reservation.findByPk(req.params.reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found", status: 404 });
    }

    if (reservation.user_id !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized", status: 401 });
    }

    reservation.time = req.body.time;
    reservation.date = req.body.date;
    reservation.seats = req.body.seats;
    reservation.updatedAt = new Date();

    await reservation.save();
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", status: 500 });
  }
});

// Get reservations for a restaurant
router.get('/:restaurantId/reservations', async (req, res) => {
  try {
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
          attributes: [
            "id",
            "owner_id",
            "address",
            "city",
            "state",
            "zip_code",
            "Openinghours",
            "name",
            "phone",
            "food_type",
            "logo"
          ]
        }
      ]
    });

    res.json({ reservations });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", status: 500 });
  }
});

module.exports = router;
