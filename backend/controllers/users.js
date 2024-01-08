/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const STATUS_CODE = require('../utils/constants');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');
const ConflictError = require('../errors/conflict');
const IncorrectEmailPasswordError = require('../errors/incorrect');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(STATUS_CODE.OK_CODE).send({ users }))
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => {
      res.status(STATUS_CODE.OK_CODE).send({ user });
    })
    .catch((err) => {
      if (err.message === 'CastError') {
        return next(new BadRequestError('Передан некорректный _id пользователя'));
      }
      return next(err);
    });
};

const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name, about, avatar, email, password: hash,
    });
    return res.status(STATUS_CODE.CREATE_CODE).send({
      email: newUser.email,
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      _id: newUser._id,
    });
  } catch (err) {
    if (err.code === STATUS_CODE.MONGO_DUPLICATE_ERROR_CODE) {
      next(new ConflictError('Такой пользователь уже существует'));
    } else if (err.name === 'BadRequestError') {
      next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    } else {
      next(err);
    }
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userAuth = await User.findOne({ email })
      .select('+password')
      .orFail(new NotFoundError('Пользователь по указанному _id не найден'));
    const matched = await bcrypt.compare(password, userAuth.password);
    if (!matched) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }
    const { NODE_ENV, JWT_SECRET } = process.env;
    const token = jwt.sign(
      { _id: userAuth._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    return res.cookie('jwt', token, {
      maxAge: '604800',
      httpOnly: true,
    }).status(STATUS_CODE.OK_CODE)
      .send({ token });
  } catch (err) {
    if (err.message === 'CastError') {
      return next(new IncorrectEmailPasswordError('Неправильный email или пароль'));
    }
    return next(err);
  }
};

const logout = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход из системы' });
};

const updateProfile = (req, res, next) => {
  const userData = req.body;
  const userId = req.user._id;
  if (userId) {
    return User.findByIdAndUpdate(userId, userData, {
      runValidators: true,
      new: true,
    })
      .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
      .then((user) => res.status(STATUS_CODE.OK_CODE).send({ user }))
      .catch((err) => {
        if (err.message === 'CastError') {
          return next(new NotFoundError('Передан некорректный _id'));
        }
        if (err.name === 'BadRequestError') {
          return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
        }
        return next(err);
      });
  }
};

const updateAvatar = (req, res, next) => {
  const userData = req.body;
  const userId = req.user._id;
  const userAvatar = userData.avatar;
  if (userId) {
    return User.findByIdAndUpdate(
      userId,
      { avatar: userAvatar },
      {
        runValidators: true,
        new: true,
      },
    )
      .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
      .then((user) => res.status(STATUS_CODE.OK_CODE).send({ user }))
      .catch((err) => {
        if (err.message === 'CastError') {
          return next(new NotFoundError('Передан некорректный _id'));
        }
        if (err.name === 'BadRequestError') {
          return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
        }
        return next(err);
      });
  }
};

const getMe = (req, res, next) => {
  const { _id } = req.user;
  return User
    .findById(_id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        return res.status(STATUS_CODE.OK_CODE).send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'BadRequestError') {
        return next(new BadRequestError('Передан некорректный _id пользователя'));
      }
      return next(err);
    });
};

module.exports = {
  getUsers,
  login,
  logout,
  getUser,
  getMe,
  createUser,
  updateProfile,
  updateAvatar,
};
