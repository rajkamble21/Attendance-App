import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  const handleRegister = async () => {
    if (!username || !password || !email || !phone) {
      enqueueSnackbar("All fields are required", { variant: "error" });
      return;
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      enqueueSnackbar(
        "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
        { variant: "error" }
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      enqueueSnackbar("Invalid email address", { variant: "error" });
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      enqueueSnackbar("Invalid phone number. Please enter a 10-digit number.", {
        variant: "error",
      });
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
      <div className="container">
        <div className="form">
          <h3>Register Page</h3>
          <input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
          />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="phone number"
          />
          <div className="btn">
          <button onClick={goToLogin}>Login</button>
          <button onClick={handleRegister}>Register</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
