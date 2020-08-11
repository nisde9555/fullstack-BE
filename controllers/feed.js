const { validationResult } = require('express-validator')

const io = require('../socket');
const Post = require('../models/post');
const User = require('../models/user');

exports.getPost = async (req, res, next) => {
  const userId = req.userId;
  try {
    const posts = await Post.find({creator: userId});
    res.status(200).json({message: "Fetched posts successfully!", posts});
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error)
  }
}

exports.createPost = async (req, res, next) => {
  const { name, description } = req.body;
  const userId = req.userId;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const post = await new Post({name, description, creator: userId});
    post.save();
    io.getIO().emit('posts', {
      action: 'create',
      post
    })
    res.status(201).json({message: "Successfull saved!"});
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error)
  }
}

exports.getPostById = async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.userId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Post with that ID does not exist!');
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() === userId.toString()) {
      res.status(200).json({message: "Fetched post successfully!",post, owner: true});
    } else {
      res.status(200).json({message: "Fetched post successfully!",post, owner: false});}
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error)
  }
}

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const { name, description } = req.body;
  const userId = req.userId;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const updatedPost = await Post.findByIdAndUpdate(postId, { name, description }, {new: true});
    io.getIO().emit('posts', {
      action: 'updatePost',
      updatedPost
    })
    res.status(200).json({message: "Successfully updated post!", post: updatedPost});
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error)
  }
}

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.userId;
  try {
    await Post.findByIdAndDelete(postId);
    io.getIO().emit('posts', {
      action: 'delete',
      postId
    })
    res.status(200).json({message: "Successfully deleted post!"});
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error)
  }
}

exports.getUsers = async (req, res, next) => {
  const userId = req.userId;
  try {
    const users = await User.find({_id: {$ne: userId}});
    res.status(200).json({message: "Successfully fetched users", users})
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error)
  }
}

exports.getUser = async (req, res, next) => {
  const userId = req.params.userId;
  const tokenUserId = req.userId;
  try {
    const user = await User.findById(userId);
    if (userId.toString() === tokenUserId.toString()) {
      res.status(200).json({message: "Successfully fetched user", user, owner: true})
    } else {
      res.status(200).json({message: "Successfully fetched user", user, owner: false})
    }
    console.log('user', user);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error)
  }
}

exports.editUser= async (req, res, next) => {
  const {firstName, lastName} = req.body;
  const userId = req.params.userId;
  try {
    const user = await User.findByIdAndUpdate(userId, { firstName, lastName }, {new: true});
    console.log('user', user);
    res.status(200).json({message: "Successfully changed.", user})
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error)
  }
}

exports.getMyProfile = async (req, res, next) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    console.log('user', user);
    res.status(200).json({message: "Successfully fetched user", user})
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error)
  }
}