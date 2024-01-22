import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  function handleLogin() {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    fetch(`${BASE_URL}/user/login/`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          setError(true);
        }
      })
      .then((data) => {
        const token = data.token;
        localStorage.setItem("token", token);
        navigate("/lessons");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        value={username}
        onChange={handleUsernameChange}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
      {error && (
        <div className="error">
          Invalid username or password. Please try again.
        </div>
      )}
    </div>
  );
}

export default Login;
