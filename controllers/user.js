const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const Unauthorized = require('../errors/Unauthorized');

const { SECRET_KEY, errorMessage, info } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getPersonalData = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ email: user.email, name: user.name }))
    .catch((err) => next(err));
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, name }, {
    new: true,
    runValidators: true,
  })
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError(errorMessage.userNotFound));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessage.dataNotCorrectByUpdate));
      } else if (err.code === 11000) {
        next(new ConflictError(errorMessage.emailExists));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, name, password: hash }))
    .then(() => res.status(201).send({ email, name }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessage.dataNotCorrectByCreation));
      } else if (err.code === 11000) {
        next(new ConflictError(errorMessage.emailExists));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new Unauthorized(errorMessage.loginInfoNotCorrect));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new Unauthorized(errorMessage.loginInfoNotCorrect));
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY,
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          httpOnly: true, maxAge: 3600000 * 24 * 7, sameSite: true,
        })
        .send({ token });
    })
    .catch((err) => next(err));
};

module.exports.logout = (req, res) => {
  res
    .clearCookie('jwt', {
      httpOnly: true, maxAge: 3600000 * 24 * 7, sameSite: true,
    })
    .send({ message: info.cookiesRemoved });
};
