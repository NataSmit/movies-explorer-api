const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const { info, errorMessage } = require('../utils/config');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((films) => {
      if (films.length === 0) {
        res.send({ message: info.noSavedFilms });
      } else {
        res.send(films);
      }
    })
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
        next(new BadRequestError(errorMessage.dataNotCorrectByFilmCreation));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((film) => {
      if (!film) {
        throw new NotFoundError(errorMessage.filmDoesNotexist);
      }
      if (film.owner.toString() !== req.user._id) {
        throw new ForbiddenError(errorMessage.noPermissionToDeleteFilm);
      }
      Movie.deleteOne(film)
        .then(() => {
          res.send({ message: errorMessage.filmDeleted });
        })
        .catch((err) => next(err));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(errorMessage.filmNotFound));
      } else {
        next(err);
      }
    });
};
