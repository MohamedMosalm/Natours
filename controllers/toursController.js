const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/APIFeatures');
const asyncWrapper = require('./../utils/asyncWrapper');
const AppError = require('./../utils/AppError');

const getAllTours = asyncWrapper(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .project()
    .paginate();

  const tours = await features.query;

  return res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

const createTour = asyncWrapper(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  if (!newTour) next(new AppError('Could not create', 424));
  return res.status(201).json({
    status: 'success',
    data: { tour: newTour },
  });
});

const getTour = asyncWrapper(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId, {
    _id: false,
    __v: false,
  });

  if (!tour) return next(new AppError('Tour is not find'), 404);
  return res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

const updateTour = asyncWrapper(async (req, res, next) => {
  const updateTour = await Tour.findByIdAndUpdate(req.params.tourId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updateTour) return next(new AppError('Tour is not find'), 404);

  return res.status(200).json({
    status: 'success',
    data: updateTour,
  });
});

const deleteTour = asyncWrapper(async (req, res, next) => {
  const deletedTour = await Tour.findByIdAndDelete(req.params.tourId);

  if (!deleteTour) return next(new AppError('Tour is not find'), 404);

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});

const getTourStats = asyncWrapper(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  return res.status(200).json({
    status: 'success',
    data: { stats },
  });
});

const getMonthlyPlan = asyncWrapper(async (req, res, next) => {
  const year = parseInt(req.params.year);
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
        month: 1,
        numOfTours: 1,
        tours: 1,
      },
    },
  ]);

  return res.status(200).json({
    status: 'success',
    data: { plan },
  });
});

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
};
