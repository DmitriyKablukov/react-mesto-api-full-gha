import { useContext } from 'react';
import '../index.css';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main({
  onEditProfile,
  onAddPlace,
  onEditAvatar,
  onCardClick,
  onCardLike,
  onCardDelete,
  cards,
}) {
  const { name, about, avatar } = useContext(CurrentUserContext);

  return (
    <div>
      <main className='main'>
        <section className='profile'>
          <button
            className='profile__avatar-edit'
            type='button'
            onClick={onEditAvatar}
          >
            <img className='profile__avatar' src={avatar} alt='Аватар' />
          </button>
          <div className='profile__info'>
            <div className='profile__top-bar'>
              <h1 className='profile__name'>{name}</h1>
              <button
                className='profile__edit-button'
                type='button'
                aria-label='Редактирование профиля'
                onClick={onEditProfile}
              />
            </div>
            <p className='profile__description'>{about}</p>
          </div>
          <button
            className='profile__add-button'
            type='button'
            aria-label='Добавление новых фото'
            onClick={onAddPlace}
          />
        </section>

        <section className='elements'>
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

export default Main;
