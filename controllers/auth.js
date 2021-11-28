const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const User = require('../models/User');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError('Name, Email and Password is required');
  }
  const user = await User.create({ ...req.body });
  const token = await user.createJWT();

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Must provide email and password');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError('You are not authorized access');
  }
  const isPassword = await user.comparePasswords(password);

  if (!isPassword) {
    throw new UnauthenticatedError('Password authentication error');
  }
  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user: { name: user.name, token } });
};

module.exports = {
  register,
  login,
};
