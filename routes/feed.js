const express = require('express');
const { body } = require('express-validator');

const feedControllers = require('../controllers/feed')
const isAuth = require('../middleware/is_auth');

const router = express.Router();

router.get('/posts', isAuth, feedControllers.getPost);

router.post('/post', isAuth, [
  body('name')
    .trim()
    .isLength({min: 5, max: 20}),
  body('description')
    .trim()
    .isLength({min: 5, max: 50})
  ], feedControllers.createPost);

router.get('/post/:postId', isAuth, feedControllers.getPostById);

router.put('/post/:postId', isAuth, [
  body('name')
    .trim()
    .isLength({min: 5, max: 20}),
  body('description')
    .trim()
    .isLength({min: 5, max: 50})
  ], feedControllers.updatePost);

router.delete('/post/:postId', isAuth, feedControllers.deletePost);

router.get('/users', isAuth, feedControllers.getUsers);

router.get('/user/:userId', isAuth, feedControllers.getUser);

router.put('/user/:userId', isAuth, feedControllers.editUser);

router.get('/my-profile', isAuth, feedControllers.getMyProfile);

module.exports = router;