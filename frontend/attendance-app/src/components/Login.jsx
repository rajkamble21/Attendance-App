import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const goToRegister = () => {
    navigate("/register");
  };

  const handleLogin = async () => {

    if(!username || !password){
      setUsernameError("Invalid username");
      setPasswordError("Invalid password");
      return
    }

    try {
      const response = await axios.post("http://localhost:4000/v1/auth/login", {
        username,
        password,
      });
      if (response.status === 200) {
        const token = response.data.token;
        const userId = response.data.user._id;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        const userData = JSON.stringify(response.data);
        localStorage.setItem("userData", userData);
        if (response.data.user.isadmin) {
          navigate("/alluserslist");
        } else {
          navigate("/attendance");
        }
      }
    } catch (error) {
      setUsernameError("");
      setPasswordError("");
      if (error.response.data.message) {
        if (error.response.data.message === "Invalid username") {
          setUsernameError("Invalid username");
        } else if (error.response.data.message === "Invalid password") {
          setPasswordError("Invalid password");
        }
      }
    }
  };

  useEffect(() => {
    setUsernameError("");
    setPasswordError("");
  }, [username, password]);

  return (
    <>
      <div className="container">
        <div className="form">
          <h3>Login Page</h3>
          <input
            type="username"
            className={`form-control mb-3 ${usernameError ? "is-invalid" : ""}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          {usernameError && (
            <div className="invalid-feedback">{usernameError}</div>
          )}
          <input
            type="password"
            className={`form-control mb-3 ${passwordError ? "is-invalid" : ""}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {passwordError && (
            <div className="invalid-feedback">{passwordError}</div>
          )}
          <div className="btn">
            <button className="btn btn-primary mr-2" onClick={handleLogin}>
              Login
            </button>
            <button className="btn btn-secondary" onClick={goToRegister}>
              Register
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
