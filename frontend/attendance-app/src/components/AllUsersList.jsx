import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const AllUsersList = () => {

  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  let token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/v1/attendance/allusers/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, []);


  const handleUserClick = (selectedUserId) => {
    localStorage.setItem("selectedUserId", selectedUserId);
    navigate(`/attendancereport`);
  };

  return (
    <>
      <div className="container">
        <div className="form">
          <h1>Attendance Report</h1>
          {userData ? (
            <div>
              {userData.map((user) => (
                <div key={user._id} onClick={() => handleUserClick(user._id)}>
                  <p className="item">{user.email}</p>
                  <hr />
                </div>
              ))}
            </div>
          ) : (
            <p>No attendance data available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AllUsersList;
