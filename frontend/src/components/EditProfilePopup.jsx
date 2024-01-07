import { useState, useEffect, useContext } from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <div>
      <PopupWithForm
        name='info'
        title='Редактировать профиль'
        buttonText='Сохранить'
        onClose={onClose}
        isOpen={isOpen}
        onSubmit={handleSubmit}
      >
        <div className='popup__form-input'>
          <input
            onChange={handleChangeName}
            value={name ?? ''}
            name='name'
            id='name'
            className='popup__input popup__input_data_name'
            required=''
            type='text'
            placeholder='Имя'
            minLength={2}
            maxLength={40}
          />
          <span className='popup__error' id='name-error' />
          <input
            onChange={handleChangeDescription}
            value={description ?? ''}
            name='description'
            id='description'
            className='popup__input popup__input_data_description'
            required=''
            type='text'
            placeholder='Описание'
            minLength={2}
            maxLength={200}
          />
          <span className='popup__error' id='description-error' />
        </div>
      </PopupWithForm>
    </div>
  );
}

export default EditProfilePopup;
