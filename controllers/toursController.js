const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/APIFeatures');
const asyncWrapper = require('./../utils/asyncWrapper');
const AppError = require('./../utils/AppError');
const Factory = require('./handlerFactory');

const getAllTours = Factory.getAll(Tour);

const createTour = Factory.createOne(Tour);

const getTour = Factory.getOne(Tour, { path: 'reviews' });

const updateTour = Factory.updateOne(Tour);

const deleteTour = Factory.deleteOne(Tour);

const getTourStats = asyncWrapper(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);

  return res.status(200).json({
    status: 'success',
    data: { stats }
  });
});

const getMonthlyPlan = asyncWrapper(async (req, res, next) => {
  const year = parseInt(req.params.year);
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numOfTours: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $sort: { _id: 1 }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0,
        month: 1,
        numOfTours: 1,
        tours: 1
      }
    }
  ]);

  return res.status(200).json({
    status: 'success',
    data: { plan }
  });
});

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan
};
