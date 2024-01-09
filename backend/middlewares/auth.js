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
    return next(new IncorrectEmailPasswordError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
