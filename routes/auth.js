const express = require('express');
const { body } = require('express-validator');

const auth = require('../controllers/auth');
const isAuth = require('../middleware/is_auth');

const router = express.Router();

router.post('/register', [
  body('firstName')
    .trim()
    .isLength({min: 5, max: 20}),
  body('lastName')
    .trim()
    .isLength({min: 5, max: 25}),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({min: 7, max: 20}),
  body('confirmPassword')
    .trim()
    .isLength({min: 7, max: 20})
], auth.register);

router.post('/login', [
  body('email')
    .trim()
    .isEmail(),
  body('password')
    .trim()
    .isLength({min: 7, max: 20})
], auth.login);

router.put('/password/reset', [
  body('email')
    .trim()
    .isEmail(),
  body('oldPassword') 
    .trim()
    .isLength({min: 7, max: 20}),
  body('newPassword')
    .trim()
    .isLength({min: 7, max: 20}),
  body('newPasswordConfirm')
    .trim()
    .isLength({min: 7, max: 20}),
], auth.resetPassword);

router.delete('/user', isAuth, auth.deleteUser);

module.exports = router;