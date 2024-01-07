/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const IncorrectEmailPasswordError = require('../errors/incorrect');

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return next(new IncorrectEmailPasswordError('Неправильный email или пароль'));
    }
    const { NODE_ENV, JWT_SECRET } = process.env;
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    if (err.message === 'NotAuthenticate') {
      return next(new IncorrectEmailPasswordError('Неправильный email или пароль'));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new IncorrectEmailPasswordError('С токеном что-то не так'));
    }
    return next();
  }
  req.user = payload;
  next();
};
