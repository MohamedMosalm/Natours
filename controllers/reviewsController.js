const Review = require('../models/reviewModel');
const APIFeatures = require('../utils/APIFeatures');
const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../utils/AppError');

const getAllReviews = asyncWrapper(async (req, res, next) => {
  if (req.params.tourId) req.query = { tour: req.params.tourId };
  const features = new APIFeatures(Review.find(), req.query)
    .filter()
    .sort()
    .project()
    .paginate();

  const reviews = await features.query;

  return res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews },
  });
});

const createReview = asyncWrapper(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);
  if (!newReview) next(new AppError('Could not create', 424));

  return res.status(201).json({
    status: 'success',
    data: { review: newReview },
  });
});

module.exports = {
  getAllReviews,
  createReview,
};
