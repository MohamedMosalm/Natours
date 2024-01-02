const express = require('express');
const toursController = require(`../controllers/toursController.js`);
const authController = require(`../controllers/authController`);

const reviewRouter = require('./../routes/reviewRoute');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

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
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    toursController.deleteTour,
  );

module.exports = router;
