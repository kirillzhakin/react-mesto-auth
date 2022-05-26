import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Layout from "./Layout";
import Main from "./Main";
import ImagePopup from "./ImagePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import { api } from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Login from "./Login";
import Register from "./Register";
import Error from "./Error";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import * as auth from "../utils/auth";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ email: "" });
  const [isSuccessSignUp, setIsSuccessSignUp] = useState(false);
  const navigate = useNavigate();

  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({
    name: "",
    link: "",
    isOpen: false,
  });
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([userData, cardsData]) => {
        setCurrentUser(userData);
        setCards(cardsData);
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }, []);

  //Токен
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      auth
        .checkToken(token)
        .then((response) => {
          setUserData({ email: response.data.email });
          setIsLoggedIn(true);
          navigate("/");
        })
        .catch((err) => {
          console.log(`${err}`);
        });
    }
  }, [navigate]);

  //Регистрация
  function handleRegister({ email, password }) {
    auth
      .register(email, password)
      .then((response) => {
        setUserData({ email: response.email });
        setIsSuccessSignUp(true);
        handleInfoTooltipPopupOpen();
        navigate("/sign-in");
      })
      .catch((err) => {
        console.log(`${err}`);
        setIsSuccessSignUp(false);
        handleInfoTooltipPopupOpen();
      });
  }

  //Вход
  function handleLogin({ email, password }) {
    auth
      .login(email, password)
      .then((response) => {
        if (response.token) {
          localStorage.setItem("token", response.token);
          setIsLoggedIn(true);
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  //Выход
  function handleSignOut() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/sign-in");
  }

  //Поддержка лайков и дизлайков
  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    if (isLiked) {
      api
        .dislikeCard(card.cardId, !isLiked)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card.cardId ? newCard : c))
          );
        })
        .catch((err) => {
          console.log(`${err}`);
        });
    } else {
      api
        .likeCard(card.cardId, !isLiked)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card.cardId ? newCard : c))
          );
        })
        .catch((err) => {
          console.log(`${err}`);
        });
    }
  }
  //Удаление карточки
  function handleCardDelete(card) {
    api
      .deleteCard(card.cardId)
      .then(() => {
        setCards((state) =>
          state.filter((c) => {
            return c._id !== card.cardId;
          })
        );
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  //Редактирование профиля
  function handleUpdateUser(userData) {
    api
      .setUserInfo(userData)
      .then((name, about) => {
        setCurrentUser(name, about);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  //Аватар
  function handleUpdateAvatar(data) {
    api
      .setAvatar(data)
      .then((avatar) => {
        setCurrentUser(avatar);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  //Добавить карточку
  function handleAddPlaceSubmit(data) {
    api
      .createCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  function handleInfoTooltipPopupOpen() {
    setIsInfoTooltipOpen(true);
  }
  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard({ ...card, isOpen: true });
  }

  function closeAllPopups() {
    setIsInfoTooltipOpen(false);
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setSelectedCard((state) => ({ ...state, isOpen: false }));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Routes>
          <Route
            path="/"
            element={
              <Layout
                isLoggedIn={isLoggedIn}
                userData={userData}
                handleSignOut={handleSignOut}
              />
            }
          >
            <Route
              index
              path="/"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Main
                    onEditAvatar={handleEditAvatarClick}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                    cards={cards}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="sign-up"
              element={<Register onRegister={handleRegister} />}
            />
            <Route path="sign-in" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          isSuccess={isSuccessSignUp}
        />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
