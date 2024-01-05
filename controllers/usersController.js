const User = require('../models/userModel');
const asyncWrapper = require('./../utils/asyncWrapper');
const AppError = require('../utils/AppError');
const Factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const filteredObj = {};
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredObj[key] = obj[key];
    }
  });
  return filteredObj;
};

const getAllUsers = Factory.getAll(User);
const updateUser = Factory.updateOne(User);
const deleteUser = Factory.deleteOne(User);
const getUser = Factory.getOne(User);

const updateMe = asyncWrapper(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirmation) {
    return next(
      new AppError(
        'this route is not for routes updates, please use /updatePassword',
        400
      )
    );
  }

  const filteredObject = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredObject,
    {
      new: true,
      runValidators: true
    }
  );

  return res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  });
});

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

const deactivateUser = asyncWrapper(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  return res.status(204).json({
    status: 'success',
    data: null
  });
});

const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  updateMe,
  deactivateUser,
  getMe
};
