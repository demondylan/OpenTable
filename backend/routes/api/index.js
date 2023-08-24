const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const restaurantsRouter = require('./restaurants.js');
const reviewsRouter = require('./reviews.js');
const reservationsRouter = require('./reservations.js');
const favoritesRouter = require('./favorites.js'); 

const { restoreUser } = require("../../utils/auth.js");

router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/restaurants', restaurantsRouter);
router.use('/reviews', reviewsRouter);
router.use('/reservations', reservationsRouter);
router.use('/favorites', favoritesRouter);

module.exports = router;