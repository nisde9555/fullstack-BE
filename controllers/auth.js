const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.register = async (req, res, next) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    if (password !== confirmPassword) {
      const error = new Error('Password does not match, please enter again.');
      error.statusCode = 409;
      throw error;
    }
    let hashPassword = await bcrypt.hash(password, 12);
    const user = await new User({firstName, lastName, email, password: hashPassword});
    console.log(user);
    user.save();
    res.status(201).json({message: "Successfully created!"});
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error)
  }
}

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const user = await User.findOne({email});
    if (!user) {
      const error = new Error('Invalide email or password.');
      error.statusCode = 404;
      throw error;
    }
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      const error = new Error('Invalide email or password.');
      error.statusCode = 422;
      throw error;
    }
    const token = jwt.sign({
      email: user.email,
      userId: user._id
    }, 'secret', {expiresIn: '1h'});
    res.status(200).json({message: "Successfully logged.", token, userId: user._id});
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error)
  }
}

exports.resetPassword = async (req, res, next) => {
  const { email, oldPassword, newPassword, newPasswordConfirm } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const user = await User.findOne({email});
    if (!user) {
      const error = new Error('Invalide email or password.');
      error.statusCode = 404;
      throw error;
    }
    const passwordCheck = await bcrypt.compare(oldPassword, user.password);
    if (!passwordCheck) {
      const error = new Error('Invalide email or password.');
      error.statusCode = 422;
      throw error;
    }
    if (newPassword !== newPasswordConfirm) {
      const error = new Error('New password does not match');
      error.statusCode = 422;
      throw error;
    }
    const newPasswordHash = await bcrypt.hash(newPassword, 12)
    const newUser = await User.findOneAndUpdate({email}, {password: newPasswordHash}, {new: true});
    console.log('perica', newUser);
    res.status(200).json({message: 'Successfully changed password.', user: newUser});
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error)
  }
}

exports.deleteUser = async (req, res, next) => {
  const userId = req.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    console.log('test', user);
    res.status(200).json({message: "Successfully deleted.", user});
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}