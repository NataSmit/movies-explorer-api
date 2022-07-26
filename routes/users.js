const router = require('express').Router();
const { getPersonalData, updateUser, createUser } = require('../controllers/user');

router.get('/users/me', getPersonalData);
router.patch('/users/me', updateUser);
router.post('/signup', createUser);

module.exports = router;
