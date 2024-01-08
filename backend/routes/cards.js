const router = require('express').Router();
const cardController = require('../controllers/cards');
const { validationCreateCard, validationFindCardById } = require('../middlewares/validation');

router.get('/', cardController.getCards);
router.post('/', cardController.createCard);
router.post('/', validationCreateCard, cardController.createCard);
router.delete('/:cardId', validationFindCardById, cardController.deleteCard);
router.put('/:cardId/likes', validationFindCardById, cardController.likeCard);
router.delete('/:cardId/likes', validationFindCardById, cardController.dislikeCard);

module.exports = router;
