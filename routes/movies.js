const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');
const { movieIdValidation } = require('../middlewares/joiValidation');

router.get('/', getMovies);
router.post('/', createMovie);
router.delete('/:id', movieIdValidation, deleteMovie);

module.exports = router;
