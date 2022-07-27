const router = require('express').Router();
const { getPersonalData, updateUser } = require('../controllers/user');
const { updateUserInfoValidation } = require('../middlewares/joiValidation');

router.get('/me', getPersonalData);
router.patch('/me', updateUserInfoValidation, updateUser);

module.exports = router;
