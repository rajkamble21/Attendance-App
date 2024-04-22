import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const goToRegister = () => {
    navigate("/register");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setEmailError("Invalid email");
      setPasswordError("Invalid password");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/v1/auth/login", {
        email,
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
      setEmailError("");
      setPasswordError("");
      if (error.response.data.message) {
        if (error.response.data.message === "Invalid email") {
          setEmailError("Invalid email");
        } else if (error.response.data.message === "Invalid password") {
          setPasswordError("Invalid password");
        }
      }
    }
  };

  useEffect(() => {
    setEmailError("");
    setPasswordError("");
  }, [email, password]);

  return (
    <>
      <div className="container">
        <div className="form">
          <h3 className="mb-3">Login Page</h3>
          <div className="mb-3 w-100">
            <input
              type="email"
              className={`form-control ${emailError ? "is-invalid" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
            />
            {emailError && <div className="invalid-feedback">{emailError}</div>}
          </div>
          <div className="mb-3 w-100">
            <input
              type="password"
              className={`form-control ${passwordError ? "is-invalid" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            {passwordError && (
              <div className="invalid-feedback">{passwordError}</div>
            )}
          </div>
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
