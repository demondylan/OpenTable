const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, SpotImage, User, sequelize, Review, ReviewImage } = require("../../db/models");
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

    if(review.userid === req.user.id){
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
router.get('/:spotid/reviews', async (req, res, next) => {
    const id = req.params.spotid;
    const spots = await Spot.findAll({
        where: {
          id: id
        }
      })
      for await (let spot of spots) {
        const reviews = await Review.findAll({
                 where: {spotid: spot.id}
              })
        
              if (reviews.length) {
                 let sum = 0
        
                 reviews.forEach((review) => {
                 sum += review.stars
              })
                 sum = sum / reviews.length
                 spot.dataValues.AvgRatiing = sum
              } else {
                 spot.dataValues.AvgRatiing = 0
              }
              const previewImages = await SpotImage.findAll({
                where: {
                  spotid: req.user.id,
                   preview: true,
                },
                attributes: ["url"],
              });
              
              if (previewImages.length) {
                const image = previewImages.map((value) => value.url);
                spot.dataValues.previewImage = image[0];
              } else {
                spot.dataValues.previewImage = "No Image Url";
              }
        }
    return res.json(spots)

})



module.exports = router;