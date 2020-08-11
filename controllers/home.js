const Post = require('../models/post');

exports.getHome = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const postsPerPage = 5;
  try {
    const amountPosts = await Post.countDocuments();
    if (currentPage > Math.ceil(amountPosts / postsPerPage) || currentPage <= 0) {
      const error = new Error('That page does not exit!');
      error.statusCode = 422;
      throw error;
    }
    const posts = await Post
      .find()
      .skip(currentPage * postsPerPage - postsPerPage)
      .limit(postsPerPage);
    res.status(200).json({posts,
       previous: +currentPage - 1 > 0 ? +currentPage - 1 : false, 
       next: +currentPage + 1 < Math.ceil(amountPosts / postsPerPage) + 1 ? +currentPage + 1 : false});
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error)
  }
}