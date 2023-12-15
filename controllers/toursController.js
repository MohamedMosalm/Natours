const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/APIFeatures');

const getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.tourId, {
      _id: false,
      __v: false,
    });
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const updateTour = await Tour.findByIdAndUpdate(
      req.params.tourId,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    res.status(200).json({
      status: 'success',
      data: updateTour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.tourId);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    return res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
};
