import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../Context/Modal";
import { useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";
import "./LoginForm.css";

function LoginForm() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const res = await dispatch(sessionActions.login({ credential, password }));

    if (res.errors) {
      setErrors(res.errors);
    } else {
      closeModal();
      history.push("/");
    }
  };

  return (
    <div className="login-form">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <ul className="error-list">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginForm;
