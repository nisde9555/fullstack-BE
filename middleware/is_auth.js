const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const isAuth = req.get('Authorization');
  if (!isAuth) {
    const error = new Error('You do not have token');
    error.statusCode = 401;
    throw error;
  }
  const token = isAuth.split(' ')[1];
  if (!token) {
    const error = new Error('Not Authorizated!');
    error.statusCode = 401;
    throw error;
  }
  try {
    const decoded = jwt.verify(token, 'secret');
    req.userId = decoded.userId;
  } catch (error) {
    if (error.message === "jwt expired") {
      const error = new Error('jwt expired');
      error.statusCode = 401;
      throw error;
    }
    throw error;
  }

  next();
}