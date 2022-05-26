import { url, token } from "../utils/constants.js";

class Api {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  //  1. Загрузка информации о пользователе с сервера
  getUserInfo() {
    return fetch(`${this.baseUrl}users/me`, {
      headers: this.headers,
    }).then(this._getResponseData);
  }

  // 2. Загрузка карточек с сервера
  getInitialCards() {
    return fetch(`${this.baseUrl}cards`, {
      headers: this.headers,
    }).then(this._getResponseData);
  }

  // 3. Редактирование профиля
  setUserInfo(item) {
    return fetch(`${this.baseUrl}users/me`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify({
        name: item.name,
        about: item.about,
      }),
    }).then(this._getResponseData);
  }

  // 4. Добавление новой карточки
  createCard(newCard) {
    return fetch(`${this.baseUrl}cards`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        name: newCard.name,
        link: newCard.link,
      }),
    }).then(this._getResponseData);
  }

  // 5. Отображение количества лайков карточки
  likeCard(cardId) {
    return fetch(`${this.baseUrl}cards/likes/${cardId}`, {
      method: "PUT",
      headers: this.headers,
    }).then(this._getResponseData);
  }

  // 7. Удаление карточки
  deleteCard(cardId) {
    return fetch(`${this.baseUrl}cards/${cardId}`, {
      method: "DELETE",
      headers: this.headers,
    }).then(this._getResponseData);
  }

  // 8. Постановка и снятие лайка
  dislikeCard(cardId) {
    return fetch(`${this.baseUrl}cards/likes/${cardId}`, {
      method: "DELETE",
      headers: this.headers,
    }).then(this._getResponseData);
  }

  // 9. Обновление аватара пользователя
  setAvatar(avatar) {
    return fetch(`${this.baseUrl}users/me/avatar`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify(avatar),
    }).then(this._getResponseData);
  }

  // Если сервер вернул ошибку, отклоняем Промис
  _getResponseData(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }
}

// Подключение Api
export const api = new Api({
  baseUrl: url,
  headers: {
    authorization: token,
    "Content-Type": "application/json",
  },
});
