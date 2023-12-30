const User = require('../models/userModel');
const asyncWrapper = require('./../utils/asyncWrapper');
const AppError = require('../utils/AppError');

const filterObj = (obj, ...allowedFields) => {
  const filteredObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      filteredObj[key] = obj[key];
    }
  });
  return filteredObj;
};

const getAllUsers = (req, res) => {};
const createUser = (req, res) => {};
const updateUser = (req, res) => {};
const deleteUser = (req, res) => {};
const getUser = (req, res) => {};

const updateMe = asyncWrapper(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirmation) {
    return next(
      new AppError(
        'this route is not for routes updates, please use /updatePassword',
        400,
      ),
    );
  }

  const filteredObject = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredObject,
    {
      new: true,
      runValidators: true,
    },
  );

  return res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});

const deactivateUser = asyncWrapper(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  return res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  updateMe,
  deactivateUser,
};
