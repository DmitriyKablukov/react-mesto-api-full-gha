import { useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup({ isOpen, onClose, onUpdateCards }) {
  const [card, setCard] = useState({});

  function handleChange(e) {
    setCard({ ...card, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateCards(card);
  }

  useEffect(() => {
    setCard({ link: '', name: '' });
  }, [isOpen]);

  return (
    <div>
      <PopupWithForm
        name='add'
        title='Новое место'
        buttonText='Создать'
        onClose={onClose}
        isOpen={isOpen}
        onSubmit={handleSubmit}
      >
        <div className='popup__form-input'>
          <input
            name='name'
            id='place'
            value={card.name}
            className='popup__input popup__input_data_place'
            required=''
            type='text'
            placeholder='Название'
            minLength={2}
            maxLength={30}
            onChange={handleChange}
          />
          <span className='popup__error' id='place-error' />
          <input
            name='link'
            id='link-image'
            value={card.link}
            className='popup__input popup__input_data_link'
            required=''
            type='url'
            placeholder='Ссылка на картинку'
            onChange={handleChange}
          />
          <span className='popup__error' id='link-image-error' />
        </div>
      </PopupWithForm>
    </div>
  );
}

export default AddPlacePopup;
