const express = require('express');
const usersController = require(`../controllers/usersController`);
const authController = require(`../controllers/authController`);
const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);

router
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createUser);
router
  .route('/:userId')
  .get(usersController.getUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
