const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { createUser, login, logout } = require('../controllers/user');
const auth = require('../middlewares/auth');
const { userCreationValidation, loginValidation } = require('../middlewares/joiValidation');
const NotFoundError = require('../errors/NotFoundError');
const { info } = require('../utils/config');

router.post('/signup', userCreationValidation, createUser);
router.post('/signin', loginValidation, login);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.post('/signout', logout);

router.use((req, res, next) => {
  next(new NotFoundError(info.routNotFound));
});

module.exports = router;
