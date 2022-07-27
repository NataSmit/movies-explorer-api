const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { createUser, login } = require('../controllers/user');
const auth = require('../middlewares/auth');
const { userCreationValidation, loginValidation } = require('../middlewares/joiValidation');

router.post('/signup', userCreationValidation, createUser);
router.post('/signin', loginValidation, login);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

module.exports = router;
