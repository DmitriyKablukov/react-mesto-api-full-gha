import { createRef, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const avatar = createRef();

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      avatar: avatar.current.value,
    });
  }

  useEffect(() => {
    avatar.current.value = '';
  }, [isOpen]);

  return (
    <div>
      <PopupWithForm
        name='avatar'
        title='Обновить аватар'
        buttonText='Сохранить'
        onClose={onClose}
        isOpen={isOpen}
        onSubmit={handleSubmit}
      >
        <div className='popup__form-input'>
          <input
            name='link'
            id='link-avatar'
            className='popup__input popup__input_avatar_link'
            required=''
            type='url'
            placeholder='Ссылка на аватар'
            ref={avatar}
          />
          <span className='popup__error' id='link-avatar-error' />
        </div>
      </PopupWithForm>
    </div>
  );
}

export default EditAvatarPopup;
