const express = require('express');
const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
  check('firstName')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a first name with at least 4 characters.'),
  check('lastName')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a last name with at least 4 characters.'),
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

const router = express.Router();

// User signup route
router.post('/', validateSignup, async (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;
  const user = await User.signup({ firstName, lastName, email, username, password });
  await setTokenCookie(res, user);

  return res.json({ user });
});

module.exports = router;
