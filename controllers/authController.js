const { promisify } = require('util');
const User = require('../models/userModel');
const asyncWrapper = require('./../utils/asyncWrapper');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

const signUp = asyncWrapper(async (req, res, next) => {
  const { name, email, password, passwordConfirmation } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirmation,
  });

  const token = signToken(newUser._id);

  return res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect e-mail or password!', 401));

  const token = signToken(user._id);

  return res.status(200).json({
    status: 'success',
    data: { token },
  });
});

const protect = asyncWrapper(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! please loggin to get access'),
      401,
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('the user belongs to this token is no longer exists.'),
      401,
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('use recently changed password. Please login again', 401),
    );
  }

  req.user = currentUser;
  next();
});

module.exports = {
  signUp,
  login,
  protect,
};
