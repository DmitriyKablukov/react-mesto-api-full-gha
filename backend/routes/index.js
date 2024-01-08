const express = require('express');
const router = require('express').Router();

const usersRouter = require('./users');
const cardsRouter = require('./cards');
const NotFoundError = require('../errors/not-found');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Ошибка в написании пути'));
});
router.use(express.json());

module.exports = router;
