const express = require('express');
const reviewsController = require(`../controllers/reviewsController`);
const authController = require(`../controllers/authController`);
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewsController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewsController.setTourUserIds,
    reviewsController.createReview
  );

router
  .route('/:id')
  .delete(reviewsController.deleteReview)
  .get(reviewsController.getReview)
  .patch(reviewsController.updateReview);

module.exports = router;
