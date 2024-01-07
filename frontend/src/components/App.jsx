import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import '../index.css';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { api } from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import ProtectedRoute from './ProtectedRoute';
import Register from './Register';
import Login from './Login';
import InfoTooltip from './InfoTooltip';
import error from '../images/error.svg';
import success from '../images/success.svg';
import * as auth from '../utils/auth';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({
    name: '',
    about: '',
    avatar: '',
  });
  const [cards, setCards] = useState([]);
  const [isTooltipErrorPopup, setIsTooltipErrorPopup] = useState(false);
  const [isTooltipSuccessPopup, setIsTooltipSuccessPopup] = useState(false);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserData(), api.getInitialCards()])
        .then(([userData, initialCards]) => {
          setCurrentUser(userData.user);
          setCards(initialCards.cards);
        })
        .catch((err) =>
          console.log(`Ошибка добавления карточки или получения данных. ${err}`)
        );
    }
  }, [loggedIn]);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard.card : c))
        );
      })
      .catch((err) => console.log(`Ошибка лайка карточки. ${err}`));
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => setCards((state) => state.filter((c) => c._id !== card._id)))
      .catch((err) => console.log(`Ошибка при удалении карточки. ${err}`));
  }

  function handleUpdateUser(user) {
    api
      .patchUserData(user)
      .then((userData) => {
        setCurrentUser(userData.user);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка редактирования профиля. ${err}`);
      });
  }

  function handleUpdateAvatar(avatar) {
    api
      .patchAvatar(avatar)
      .then((userData) => {
        setCurrentUser(userData.user);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка редактирования аватара. ${err}`));
  }

  function handleAddPlaceSubmit(card) {
    api
      .postCard(card)
      .then((cardData) => {
        setCards([cardData.card, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка добавления карточки. ${err}`));
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({});
    setIsTooltipErrorPopup(false);
    setIsTooltipSuccessPopup(false);
  }

  function handleCardClick(data) {
    setSelectedCard(data);
  }

  function onEditProfile() {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  function onAddPlace() {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  function onEditAvatar() {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  function handleRegistration(email, password) {
    auth
      .registerUser(email, password)
      .then((data) => {
        setIsTooltipSuccessPopup(true);
        navigate('/sign-in', { replace: true });
      })
      .catch((err) => {
        setIsTooltipErrorPopup(true);
        console.log(`Ошибка регистрации пользователя. ${err}`);
      })
      .finally(() => {
        setIsTooltipSuccessPopup(true);
      });
  }

  function handleAuthorization(email, password) {
    auth
      .authorizeUser(email, password)
      .then((data) => {
        if (data) {
          setLoggedIn(true);
          setEmail(email);
          navigate('/', { replace: true });
        }
      })
      .catch((err) => {
        console.log(`Ошибка авторизации пользователя. ${err}`);
      });
  }

  function handleExitProfile() {
    auth
      .logoutUser()
      .then(() => {
        setLoggedIn(false);
        setEmail('');
        navigate('/sign-in');
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    auth
      .checkToken()
      .then((data) => {
        if (data) {
          setLoggedIn(true);
          setEmail(data.user.email);
          navigate('/', { replace: true });
        }
      })
      .catch((err) => console.log(err));
  }, [navigate]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className='page'>
        <Routes>
          <Route
            path='/'
            element={
              <>
                <Header
                  email={email}
                  onExitProfile={'Выйти'}
                  onClick={handleExitProfile}
                  path={'/sign-in'}
                />
                <ProtectedRoute
                  onEditProfile={onEditProfile}
                  onAddPlace={onAddPlace}
                  onEditAvatar={onEditAvatar}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  cards={cards}
                  element={Main}
                  loggedIn={loggedIn}
                />
              </>
            }
          />
          <Route
            path='/sign-up'
            element={
              <>
                <Header headerLink={'Вход'} path='/sign-in' />
                <Register loggedIn={loggedIn} onRegister={handleRegistration} />
              </>
            }
          />
          <Route
            path='/sign-in'
            element={
              <>
                <Header headerLink={'Регистрация'} path='/sign-up' />
                <Login loggedIn={loggedIn} onLogin={handleAuthorization} />
              </>
            }
          />
          <Route path='/*' element={<Navigate to='/sign-in' />} />
        </Routes>
        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onUpdateCards={handleAddPlaceSubmit}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <InfoTooltip
          isOpen={isTooltipSuccessPopup}
          onClose={closeAllPopups}
          title={'Вы успешно зарегистрировались!'}
          image={success}
        />
        <InfoTooltip
          isOpen={isTooltipErrorPopup}
          onClose={closeAllPopups}
          title={'Что-то пошло не так! Попробуйте ещё раз.'}
          image={error}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
