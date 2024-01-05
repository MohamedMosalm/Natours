const Review = require('../models/reviewModel');
const APIFeatures = require('../utils/APIFeatures');
const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../utils/AppError');
const Factory = require('./handlerFactory');

const setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const getAllReviews = Factory.getAll(Review);

const createReview = Factory.createOne(Review);

const deleteReview = Factory.deleteOne(Review);

const getReview = Factory.getOne(Review);

const updateReview = Factory.updateOne(Review);

module.exports = {
  getAllReviews,
  createReview,
  deleteReview,
  getReview,
  updateReview,
  setTourUserIds
};
