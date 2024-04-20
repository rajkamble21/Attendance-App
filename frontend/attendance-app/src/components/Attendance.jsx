import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useSnackbar } from "notistack";


const Attendance = () => {

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  let token = localStorage.getItem("token");
  let userId = localStorage.getItem("userId");


  useEffect(()=>{
    if(!localStorage.getItem("token")){
      enqueueSnackbar("Login First", { variant: "success" });
      navigate('/login');
    }
  }, []);


  const [userData, setUserData] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());



  


  

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


  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second
  
    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, []);
  


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



  return (
    <>
      <div class="container">
  <div class="form">
    <h1 class="text-center mb-4">Attendance</h1>
    <div class="text-center mb-4">
      <p class="font-weight-bold">
        {currentDateTime.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}
      </p>
      <p class="font-weight-bold">
        {currentDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
      </p>
    </div>
    <div class="text-center mb-4">
      {userData ? (
        userData.ispresent ? (
          <button class="btn btn-danger" onClick={handleSignOut}>Sign Out</button>
        ) : (
          <button class="btn btn-success" onClick={handleSignIn}>Sign In</button>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
    <div class="text-center">
      <button class="btn btn-primary report" onClick={() => navigate('/attendancereport')}>View Report</button>
    </div>
  </div>
</div>

    </>
  );
};

export default Attendance;
