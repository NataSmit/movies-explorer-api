const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError')

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((films) => res.send(films))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailerLink, nameRU, nameEN,
    thumbnail, movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((film) => res.status(201).send(film))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findByIdAndRemove(req.params._id)
    .then(() => res.send('Фильм удален'))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Фильм не найден (некорректный id)'));
      } else {
        next(err);
      }
    });
}
