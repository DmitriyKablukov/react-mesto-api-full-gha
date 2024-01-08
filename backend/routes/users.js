const router = require('express').Router();
const userController = require('../controllers/users');

const { validationUpdateProfile, validationUpdateAvatar, validationGetUser } = require('../middlewares/validation');

router.patch('/me', validationUpdateProfile, userController.updateProfile);
router.patch('/me/avatar', validationUpdateAvatar, userController.updateAvatar);
router.get('/', userController.getUsers);
router.get('/me', userController.getMe);
router.get('/:userId', validationGetUser, userController.getUser);

module.exports = router;
