const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Favorite, Reservation, User, sequelize, Review, Restaurant } = require("../../db/models");
const { check } = require("express-validator");
const sequelized = require("sequelize");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
    const reviews = await Review.findAll({
        where: {
            userid: req.user.id
        },

        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName"],
                subQuery: false,
            },
            {
                model: Restaurant,
                attributes: ["id", "owner_id", "address", "city", "state", "zip_code", "open", "close", "name", "phone", "food_type", "logo"],
                subQuery: false,
            }
        ]
    })
    res.json({ Review: reviews })
})

router.delete('/:reviewsId', async (req, res) => {
    const review = await Review.findByPk(req.params.reviewsId)
    if (!review) {
        res.status(404).json({ message: "Review couldn't be found", status: 404 })
    }

    if(review.user_id === req.user.id){
        await review.destroy()
        res.json(review)
    }else{
        res.status(401).json({ message: "Must be the owner to delete the review", status: 404 })
    }
})

router.put('/:reviewsid', requireAuth, async (req, res, next) => {
    const id = req.params.reviewsid;
    const reviews = await Review.findByPk(id)
    if (!reviews) {
        res.status(404).json({ message: "Review couldn't be found", status: 404 })
    }

    await reviews.update({
        value_rating: req.body.value_rating,
        service_rating: req.body.service_rating,
        food_rating: req.body.food_rating,
        message: req.body.message,
        ambience_rating: req.body.ambience_rating,
        createdAt: sequelized.literal("CURRENT_TIMESTAMP"),
        updatedAt: sequelized.literal("CURRENT_TIMESTAMP")
    });

    await reviews.save
    return res.json(reviews)

});
router.get('/:restaurantid/reviews', async (req, res, next) => {
    const id = req.params.restaurantid;
    const restaurants = await Restaurant.findAll({
        where: {
          id: id
        }
      })
      for await (let restaurant of restaurants) {
        const reviews = await Review.findAll({
                 where: {restaurant_id: restaurant.id}
              })
        
        }
    return res.json(restaurants);

})



module.exports = router;