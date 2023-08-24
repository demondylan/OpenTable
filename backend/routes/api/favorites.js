const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { Favorite, User, Restaurant, Openinghour } = require("../../db/models");

const router = express.Router();

// Get current user's favorite restaurants
router.get('/', requireAuth, async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: {
        user_id: req.user.id,
      },
      include: [
        {
          model: Restaurant,
          attributes: [
            'id',
            'owner_id',
            'name',
            'address',
            'city',
            'state',
            'zip_code',
            'phone',
            'food_type',
            'logo',
            'rating'
          ],
          include: [
            {
              model: User,
              attributes: ['id', 'firstName', 'lastName'],
            },
            { model: Openinghour },
          ],
        },
      ],
    });

    res.json({ favorites });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', status: 500 });
  }
});


router.post("/:restaurantId", requireAuth, async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const favorite = await Favorite.create({
      user_id: req.user.id,
      restaurant_id: restaurantId
    });

    const populatedFavorite = await Favorite.findOne({
      where: { id: favorite.id },
      include: [
        {
          model: Restaurant,
          attributes: [
            'id',
            'owner_id',
            'name',
            'address',
            'city',
            'state',
            'zip_code',
            'phone',
            'food_type',
            'logo',
            'rating'
          ]
        }
      ]
    });

    res.json({ favorite: populatedFavorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", status: 500 });
  }
});

// Remove a restaurant from favorites
router.delete("/:favoriteId", requireAuth, async (req, res) => {
  try {
    const favoriteId = req.params.favoriteId;
    const favorite = await Favorite.findByPk(favoriteId);
    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found", status: 404 });
    }

    if (favorite.user_id !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized", status: 401 });
    }

    await favorite.destroy();
    res.json({ message: "Favorite removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", status: 500 });
  }
});

module.exports = router;