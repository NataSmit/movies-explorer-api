const { celebrate, Joi } = require('celebrate');
const { linkRegexValidator } = require('../regex/linkValidation');

module.exports.userCreationValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports.updateUserInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
});

module.exports.movieIdValidation = celebrate({
  params: Joi.object({
    id: Joi.string().hex().length(24),
  }),
});

module.exports.movieCreationValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(linkRegexValidator),
    trailerLink: Joi.string().required().pattern(linkRegexValidator),
    thumbnail: Joi.string().required().pattern(linkRegexValidator),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});
