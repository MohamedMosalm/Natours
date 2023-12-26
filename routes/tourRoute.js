const express = require('express');
const toursController = require(`../controllers/toursController.js`);
const authController = require(`../controllers/authController`);

const router = express.Router();

router.route('/tour-stats').get(toursController.getTourStats);
router.route('/monthly-plan/:year').get(toursController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, toursController.getAllTours)
  .post(toursController.createTour);

router
  .route('/:tourId')
  .get(toursController.getTour)
  .patch(toursController.updateTour)
  .delete(toursController.deleteTour);

module.exports = router;
