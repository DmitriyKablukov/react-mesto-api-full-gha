/* eslint-disable consistent-return */
const Card = require('../models/card');
const STATUS_CODE = require('../utils/constants');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');
const NoAccessError = require('../errors/no-access');

const getCards = (req, res, next) => {
  Card.find()
    .then((cards) => res.status(STATUS_CODE.OK_CODE).send({ cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const cardData = req.body;
  cardData.owner = req.user._id;
  return Card.create(cardData)
    .then((card) => res.status(STATUS_CODE.CREATE_CODE).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const removeCard = () => {
    Card.findByIdAndDelete(req.params.cardId)
      .then(() => res.status(STATUS_CODE.OK_CODE).send({ message: 'Карточка удалена' }))
      .catch(next);
  };
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) next(new NotFoundError('Передан несуществующий _id карточки'));
      if (req.user._id === card.owner.toString()) {
        return removeCard();
      }
      return next(new NoAccessError('Вы не можете удалять карточки других пользователей'));
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      return res.status(STATUS_CODE.OK_CODE).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорректный _id карточки'));
      }
      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      return res.status(STATUS_CODE.OK_CODE).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорректный _id карточки'));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
