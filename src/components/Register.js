import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Register({ onRegister }) {
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setState({...state, [name]: value });
  }


  function handleSubmit(e) {
    e.preventDefault();
    onRegister({ email: state.email, password: state.password });
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="popup__form popup__form-route">
        <h2 className="popup__title popup__title-route">Регистрация</h2>

        <input
          type="email"
          name="email"
          id="register-email"
          className="popup__field popup__field-route"
          placeholder="Email"
          required
          value={state.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          id="register-password"
          className="popup__field popup__field-route "
          placeholder="Пароль"
          required
          value={state.password}
          onChange={handleChange}
        />

        <button type="submit" className="popup__button popup__button-route">
          Зарегестрироваться
        </button>
      </form>
      <div className="popup__signin">
        <p className="popup__signin-paragraf">Уже зарегистрированы?</p>
        <Link className="popup__nav" to="/sign-in">
          Войти
        </Link>
      </div>
    </>
  );
}

export default Register;
