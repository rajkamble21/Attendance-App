import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [modal, setModal] = useState(false);
  const [editedUserData, setEditedUserData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
  });
  const [enablePassEdit, setEnablePassEdit] = useState(true);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

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
        setEditedUserData(response.data); // Set editedUserData to current user data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId && token) {
      fetchUserData();
    }
  }, [userId, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/v1/attendance/updateuser/${userId}`,
        editedUserData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("User updated:", response.data);
      setModal(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="container-sm py-4">
      <h2 className="mb-4 text-center">Profile</h2>
      {modal ? (
        <div className="card p-4">
          <div className="mb-3 row">
            <label htmlFor="username" className="col-sm-1 col-form-label">
              Username
            </label>
            <div className="col-sm-11">
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={editedUserData.username}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="email" className="col-sm-1 col-form-label">
              Email
            </label>
            <div className="col-sm-11">
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={editedUserData.email}
                onChange={handleInputChange}
                disabled={true}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="phone" className="col-sm-1 col-form-label">
              Phone
            </label>
            <div className="col-sm-11">
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                value={editedUserData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="mb-3 row">
            <div className="col-sm-1"></div>
            <div className="col-sm-11">
              <input
                type="checkbox"
                className="form-check-input p-2 m-2"
                id="gridCheck1"
                name="checkbox"
                value={enablePassEdit}
                onClick={()=>{setEnablePassEdit(!enablePassEdit)}}
              />
              <label htmlFor="gridCheck1" className="col-form-label">
                Do you want to edit password
              </label>
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="password" className="col-sm-1 col-form-label">
              Password
            </label>
            <div className="col-sm-11">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={editedUserData.password}
                onChange={handleInputChange}
                disabled={enablePassEdit}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="password" className="col-sm-1 col-form-label">
              Confirm Password
            </label>
            <div className="col-sm-11">
              <input
                type="password"
                className="form-control"
                id="password"
                name="confirmPassword"
                value={editedUserData.confirmPassword}
                onChange={handleInputChange}
                disabled={enablePassEdit}
              />
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <button className="btn btn-primary" onClick={handleUpdateProfile}>
              Save
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="card p-4">
          <p className="mb-2">Username: {editedUserData.username}</p>
          <p className="mb-2">Email: {editedUserData.email}</p>
          <p className="mb-2">Phone: {editedUserData.phone}</p>
          <p className="mb-2">Password: {editedUserData.password}</p>
          <button className="btn btn-primary" onClick={() => setModal(true)}>
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
