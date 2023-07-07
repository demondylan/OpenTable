const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const restaurantsRouter = require('./restaurants.js');
const reviewsRouter = require('./reviews.js');
const reservationsRouter = require('./reservations.js');

const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/restaurants', restaurantsRouter);
router.use('/reviews', reviewsRouter);
router.use('/reservations', reservationsRouter);


module.exports = router;