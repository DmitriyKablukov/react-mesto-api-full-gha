class Api {
  constructor({ baseUrl, headers, credentials }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
    this._credentials = 'include';
  }
  //Проверка ответа
  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }
  //Обработка данных ответа
  _handleData(url, { method, credentials, headers, body }) {
    return fetch(`${this._baseUrl}${url}`, {
      method,
      headers,
      credentials,
      body,
    }).then(this._checkResponse);
  }
  //Загрузка карточек
  getInitialCards() {
    return this._handleData('/cards', {
      method: 'GET',
      credentials: 'include',
      headers: this._headers,
    });
  }
  //Загрузка данных пользователя
  getUserData() {
    return this._handleData('/users/me', {
      method: 'GET',
      credentials: 'include',
      headers: this._headers,
    });
  }
  //Редактирование профиля
  patchUserData(data) {
    return this._handleData('/users/me', {
      method: 'PATCH',
      credentials: this._credentials,
      headers: this._headers,
      body: JSON.stringify({ name: data.name, about: data.about }),
    });
  }
  //Добавление новой карточки
  postCard(cardData) {
    return this._handleData('/cards', {
      method: 'POST',
      credentials: this._credentials,
      headers: this._headers,
      body: JSON.stringify(cardData),
    });
  }
  //Удаление карточки
  deleteCard(id) {
    return this._handleData(`/cards/${id}`, {
      method: 'DELETE',
      credentials: this._credentials,
      headers: this._headers,
    });
  }
  //Обновление аватара пользователя
  patchAvatar(avatar) {
    return this._handleData('/users/me/avatar', {
      method: 'PATCH',
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify(avatar),
    });
  }
  //Постановка лайка
  putLike(id) {
    return this._handleData(`/cards/${id}/likes`, {
      method: 'PUT',
      credentials: this._credentials,
      headers: this._headers,
    });
  }
  //Снятие лайка
  deleteLike(id) {
    return this._handleData(`/cards/${id}/likes`, {
      method: 'DELETE',
      credentials: this._credentials,
      headers: this._headers,
    });
  }

  changeLikeCardStatus(cardId, isLiked) {
    return isLiked ? this.deleteLike(cardId) : this.putLike(cardId);
  }
}

const api = new Api({
  baseUrl: 'https://kablukov.students.nomoredomainsmonster.ru',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
});

export { api, Api };
