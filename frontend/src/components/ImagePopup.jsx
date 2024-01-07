function ImagePopup({ onClose, card }) {
  return (
    <div
      className={`popup 'popup_image'${
        Object.keys(card).length ? ' popup_opened' : ''
      }`}
    >
      <div className='popup__image-container'>
        <button
          onClick={onClose}
          type='button'
          className='popup__close-button popup__close-button_image'
        ></button>
        <img src={card.link} alt={card.name} className='popup__image-picture' />
        <p className='popup__image-place-name'>{card.name}</p>
      </div>
    </div>
  );
}

export default ImagePopup;
