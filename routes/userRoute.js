const express = require('express');
const usersController = require(`../controllers/usersController`);
const authController = require(`../controllers/authController`);
const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updatePassword', authController.updatePassword);
router.patch('/updateMe', authController.protect, usersController.updateMe);
router.delete(
  '/deactivateUser',
  authController.protect,
  usersController.deactivateUser
);
router.get(
  '/me',
  authController.protect,
  usersController.getMe,
  usersController.getUser
);

router
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createUser);

router
  .route('/:id')
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
