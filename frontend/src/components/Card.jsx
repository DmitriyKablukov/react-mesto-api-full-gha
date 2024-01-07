import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);
  //const isOwn = card.owner._id === currentUser._id;
  const isOwn = card.owner === currentUser._id;
  //const isLiked = card.likes.some((i) => i._id === currentUser._id);
  const isLiked = card.likes.some((i)=> i === currentUser._id);
  const cardLikeButtonClassName = `element__like-button ${isLiked && "element__like-button_active"}`;

  function handleLikeClick() {
    onCardLike(card);
  };

  function handleClick() {
    onCardClick(card);
  };

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <article className="element">
      {isOwn && <button className="element__delete-button" type="button" aria-label="Удаление карточки" onClick={handleDeleteClick}></button>}
      <img
        onClick={handleClick}
        src={card.link}
        alt={card.name}
        className="element__image"
      />
      <div className="element__bottom-bar">
        <h2 className="element__place-name">{card.name}</h2>
        <div className="element__like">
          <button
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
            type="button"
            aria-label="Отметка мне нравится"
          />
          <p className="element__like-counter">{card.likes.length}</p>
        </div>
      </div>
    </article>
  );
}

export default Card;