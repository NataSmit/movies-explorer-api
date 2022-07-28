const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const { SECRET_KEY } = require('../config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  if (!req.cookies) {
    return new Unauthorized('Пользователь не авторизован');
  }
  const token = req.cookies.jwt;
  let payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY);

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY);
  } catch (err) {
    next(new Unauthorized('Пользователь не авторизован'));
  }

  req.user = payload;

  next();
};
