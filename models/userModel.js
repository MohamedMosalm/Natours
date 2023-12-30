const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user name is required'],
  },
  email: {
    type: String,
    required: [true, 'A user email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please enter a valid email'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'guide', 'user', 'lead-guide'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'A user password is required'],
    minlength: 8,
    select: false,
  },
  passwordConfirmation: {
    type: String,
    required: [true, 'A user password confirmation is required'],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: `password confirmation doesn't match password`,
    },
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: { type: Boolean, default: true, select: false },
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirmation = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  reqPassword,
  userPassword,
) {
  return await bcrypt.compare(reqPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return changedTimestamp > JWTTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
