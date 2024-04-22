import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();


  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  const goToLogin = () => {
    navigate("/login");
  };

  const handleRegister = async () => {
    if (!username || !password || !email || !phone || !confirmpassword) {
      enqueueSnackbar("All fields are required", { variant: "error" });
      return;
    }

    console.log("Form Data", {
      username,
      password,
      email,
      phone,
    });
    try {
      const response = await axios.post(
        "http://localhost:4000/v1/auth/register",
        {
          username,
          password,
          email,
          phone,
        }
      );
      if (response.status === 201) {
        enqueueSnackbar("Registered Successfully", { variant: "success" });
        navigate("/login");
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error.response.data.message);
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  return (
    <>
      <div class="container">
        <div class="form">
          <h3>Register Page</h3>
          <input
            type="username"
            className={`form-control mb-3 ${
              username.length === 0
                ? ""
                : username.length >= 6
                ? "is-valid"
                : "is-invalid"
            }`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          {username.length > 0 && username.length < 8 && (
            <div className="invalid-feedback">
              Username must be at least 8 characters long.
            </div>
          )}

          <input
            type="email"
            className={`form-control mb-3 ${
              email.length === 0
                ? ""
                : emailRegex.test(email)
                ? "is-valid"
                : "is-invalid"
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          {email.length > 0 && !emailRegex.test(email) && (
            <div className="invalid-feedback">Invalid email address.</div>
          )}

          <input
            type="text"
            className={`form-control mb-3 ${
              phone.length === 0
                ? ""
                : phoneRegex.test(phone)
                ? "is-valid"
                : "is-invalid"
            }`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
          />
          {phone.length > 0 && !phoneRegex.test(phone) && (
            <div className="invalid-feedback">
              Invalid phone number. Please enter a 10-digit number.
            </div>
          )}

          <input
            type="password"
            className={`form-control mb-3 ${
              password.length === 0
                ? ""
                : strongPasswordRegex.test(password)
                ? "is-valid"
                : "is-invalid"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {password.length > 0 && !strongPasswordRegex.test(password) && (
            <div className="invalid-feedback">
              {!/(?=.*[a-z])/.test(password) && (
                <div>Password must contain at least one lowercase letter.</div>
              )}
              {!/(?=.*[A-Z])/.test(password) && (
                <div>Password must contain at least one uppercase letter.</div>
              )}
              {!/(?=.*\d)/.test(password) && (
                <div>Password must contain at least one number.</div>
              )}
              {!/(?=.*[@$!%*?&#])/.test(password) && (
                <div>Password must contain at least one special character.</div>
              )}
              {password.length < 8 && (
                <div>Password must be at least 8 characters long.</div>
              )}
            </div>
          )}

          <input
            type="password"
            className={`form-control mb-3 ${
              confirmpassword.length === 0
                ? ""
                : password === confirmpassword
                ? "is-valid"
                : "is-invalid"
            }`}
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Password"
          />
          {confirmpassword.length > 0 && password !== confirmpassword && (
            <div className="invalid-feedback">Password does'nt match</div>
          )}

          <div class="btn">
            <button class="btn btn-secondary mr-2" onClick={goToLogin}>
              Login
            </button>
            <button class="btn btn-primary" onClick={handleRegister}>
              Register
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
