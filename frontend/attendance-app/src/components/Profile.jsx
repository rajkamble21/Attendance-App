import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

const Profile = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [userData, setUserData] = useState(null);
  const [modal, setModal] = useState(false);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [editedConfirmPassword, setEditedConfirmPassword] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [enablePassEdit, setEnablePassEdit] = useState(true);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/v1/attendance/getuser/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
        setEditedUsername(response.data.username);
        setEditedEmail(response.data.email);
        setEditedPhone(response.data.phone);
        setEditedPassword(response.data.password);
        setEditedConfirmPassword(response.data.password);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId && token) {
      fetchUserData();
    }
  }, [userId, token]);

  const handleUpdateProfile = async () => {
    if (
      !editedUsername ||
      !editedPassword ||
      !editedEmail ||
      !editedPhone ||
      !editedConfirmPassword
    ) {
      enqueueSnackbar("All fields are required", { variant: "error" });
      return;
    }
    try {
      const editedUserData = {
        username: editedUsername,
        password: editedPassword,
        email: editedEmail,
        phone: editedPhone,
      };
      const response = await axios.put(
        `http://localhost:4000/v1/attendance/updateuser/${userId}`,
        editedUserData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserData(response.data);
      setModal(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const closeModel = () => {
    setEditedUsername(userData.username);
    setEditedEmail(userData.email);
    setEditedPhone(userData.phone);
    setEditedPassword(userData.password);
    setEditedConfirmPassword(userData.password);
    setModal(false);
  };

  return (
    <div className="container-sm py-4">
      <h2 className="mb-4 text-center">Profile</h2>
      {modal ? (
        <div className="card p-4">
          <div className="mb-3 row">
            <label htmlFor="username" className="col-sm-2 col-form-label">
              Username
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className={`form-control ${
                  editedUsername === userData.username
                    ? ""
                    : editedUsername.length >= 6
                    ? "is-valid"
                    : "is-invalid"
                }`}
                id="username"
                name="username"
                value={editedUsername}
                onChange={(e) => setEditedUsername(e.target.value)}
              />
              {editedUsername !== userData.username &&
                editedUsername.length < 8 && (
                  <div className="invalid-feedback">
                    Username must be at least 8 characters long.
                  </div>
                )}
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="email" className="col-sm-2 col-form-label">
              Email
            </label>
            <div className="col-sm-10">
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                disabled={true}
              />
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="phone" className="col-sm-2 col-form-label">
              Phone
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className={`form-control ${
                  editedPhone === userData.phone
                    ? ""
                    : phoneRegex.test(editedPhone)
                    ? "is-valid"
                    : "is-invalid"
                } `}
                id="phone"
                name="phone"
                value={editedPhone}
                onChange={(e) => setEditedPhone(e.target.value)}
              />
              {editedPhone !== userData.phone &&
                !phoneRegex.test(editedPhone) && (
                  <div className="invalid-feedback">
                    Invalid phone number. Please enter a 10-digit number.
                  </div>
                )}
            </div>
          </div>

          <div className="mb-3 row">
            <div className="col-sm-2"></div>
            <div className="col-sm-10">
              <input
                type="checkbox"
                className="form-check-input p-2 m-2"
                id="gridCheck1"
                name="checkbox"
                value={enablePassEdit}
                onClick={() => {
                  setEnablePassEdit(!enablePassEdit);
                }}
              />
              <label htmlFor="gridCheck1" className="col-form-label">
                Do you want to edit password
              </label>
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="password" className="col-sm-2 col-form-label">
              Password
            </label>
            <div className="col-sm-10">
              <input
                type="password"
                className={`form-control  ${
                  editedPassword === userData.password
                    ? ""
                    : strongPasswordRegex.test(editedPassword)
                    ? "is-valid"
                    : "is-invalid"
                }`}
                id="password"
                name="password"
                value={editedPassword}
                onChange={(e) => setEditedPassword(e.target.value)}
                disabled={enablePassEdit}
              />
              {editedPassword !== userData.password &&
                !strongPasswordRegex.test(editedPassword) && (
                  <div className="invalid-feedback">
                    {!/(?=.*[a-z])/.test(editedPassword) && (
                      <div>
                        Password must contain at least one lowercase letter.
                      </div>
                    )}
                    {!/(?=.*[A-Z])/.test(editedPassword) && (
                      <div>
                        Password must contain at least one uppercase letter.
                      </div>
                    )}
                    {!/(?=.*\d)/.test(editedPassword) && (
                      <div>Password must contain at least one number.</div>
                    )}
                    {!/(?=.*[@$!%*?&#])/.test(editedPassword) && (
                      <div>
                        Password must contain at least one special character.
                      </div>
                    )}
                    {editedPassword.length < 8 && (
                      <div>Password must be at least 8 characters long.</div>
                    )}
                  </div>
                )}
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="password" className="col-sm-2 col-form-label">
              Confirm Password
            </label>
            <div className="col-sm-10">
              <input
                type="password"
                className={`form-control ${
                  editedPassword === userData.password
                    ? ""
                    : editedPassword === editedConfirmPassword
                    ? "is-valid"
                    : "is-invalid"
                }`}
                id="password"
                name="confirmPassword"
                value={editedConfirmPassword}
                onChange={(e) => setEditedConfirmPassword(e.target.value)}
                disabled={enablePassEdit}
              />
              {editedConfirmPassword !== editedPassword &&
                editedPassword !== editedConfirmPassword && (
                  <div className="invalid-feedback">Password does'nt match</div>
                )}
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <button className="btn btn-primary" onClick={handleUpdateProfile}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={closeModel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="card p-4">
          {userData && (
            <>
              <p className="mb-2">Username: {userData.username}</p>
              <p className="mb-2">Email: {userData.email}</p>
              <p className="mb-2">Phone: {userData.phone}</p>
              <p className="mb-2">Password: {userData.password}</p>
            </>
          )}
          <button className="btn btn-primary" onClick={() => setModal(true)}>
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
