import React, { useState } from "react";

function Login({onLogin}) {
  const [inputs, setState] = useState({
    email: '',
    password: ''
  });

  function handleChange(e){  
    const {name, value} = e.target;    
    setState({...inputs, [name]: value})
  }

  function handleSubmit(e) {
    e.preventDefault();
    onLogin({ email: inputs.email, password: inputs.password });
    
  }
  return (
    <>
      <form onSubmit={handleSubmit} className="popup__form  popup__form-route ">
        <h2 className="popup__title popup__title-route">Вход</h2>

        <input
          type="email"
          name="email"
          id="login-email"
          className="popup__field popup__field-route"
          placeholder="Email"
          required
          value={inputs.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          id="login-password"
          className="popup__field popup__field-route "
          placeholder="Пароль"
          required
          value={inputs.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          name="submit"
          className="popup__button popup__button-route"
        >
          Войти
        </button>
      </form>
    </>
  );
}

export default Login;
