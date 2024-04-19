import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Attendance = () => {
  const [userData, setUserData] = useState(null);
  let token = localStorage.getItem("token");
  let userId = localStorage.getItem("userId");
  console.log("token", token);
  console.log("userId", userId);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
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
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (token && userId) {
      fetchData();
    } else {
      console.log("No token awailable");
    }
  }, [token, userId]);


  const handleSignIn = async () => {
    try {
      const response = await axios.post(
        `http://localhost:4000/v1/attendance/signin/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setUserData({ ...userData, ispresent: true });
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await axios.post(
        `http://localhost:4000/v1/attendance/signout/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setUserData({ ...userData, ispresent: false });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTime = (date) => {
    const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const meridiem = date.getHours() < 12 ? "AM" : "PM";
    return `${hours}:${minutes}:${seconds} ${meridiem}`;
  };


  const currentDate = formatDate(new Date());
  const currentTime = formatTime(new Date());

  return (
    <>
      <div className="container">
        <div className="form">
          <h1>Attendance</h1>
          <div>
            <p>{currentDate}</p>
            <p>{currentTime}</p>
          </div>
          <div>
            {userData ? (
              userData.ispresent ? (
                <button onClick={handleSignOut}>signout</button>
              ) : (
                <button onClick={handleSignIn}>signin</button>
              )
            ) : (
              <p>Loading</p>
            )}
          </div>


          <div className="btn">
          <button onClick={()=>(navigate('/attendancereport'))} className="report">View Report</button>
          {userData && userData.isadmin ? <button onClick={()=>(navigate('/alluserslist'))} className="view_user">View users</button> : <></>}
          </div>

          
          
        </div>
      </div>
    </>
  );
};

export default Attendance;
