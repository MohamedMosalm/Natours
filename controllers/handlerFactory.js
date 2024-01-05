const APIFeatures = require('../utils/APIFeatures');
const asyncWrapper = require('./../utils/asyncWrapper');
const AppError = require('./../utils/AppError');

const deleteOne = Model =>
  asyncWrapper(async (req, res, next) => {
    const deletedDoc = await Model.findByIdAndDelete(req.params.id);

    if (!deletedDoc) return next(new AppError('Document is not found'), 404);

    return res.status(204).json({
      status: 'success',
      data: null
    });
  });

const getAll = Model =>
  asyncWrapper(async (req, res, next) => {
    if (req.params.tourId) req.query = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .project()
      .paginate();

    const docs = await features.query;

    return res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs
      }
    });
  });

const createOne = Model =>
  asyncWrapper(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    if (!newDoc) next(new AppError('Could not create', 424));
    return res.status(201).json({
      status: 'success',
      data: {
        data: newDoc
      }
    });
  });

const getOne = (Model, popOptions) =>
  asyncWrapper(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) return next(new AppError('Document is not found'), 404);
    return res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

const updateOne = Model =>
  asyncWrapper(async (req, res, next) => {
    const updateDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updateDoc) return next(new AppError('Document is not found'), 404);

    return res.status(200).json({
      status: 'success',
      data: {
        data: updateDoc
      }
    });
  });

module.exports = {
  deleteOne,
  getAll,
  createOne,
  getOne,
  updateOne
};
