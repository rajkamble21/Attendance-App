import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";


const AllUsersList = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(()=>{
    if(!localStorage.getItem("token")){
      enqueueSnackbar("Login First", { variant: "success" });
      navigate('/login');
    }
  }, []);


  const [userData, setUserData] = useState(null);
  let token = localStorage.getItem("token");
  if(!token){
    navigate('/login');
  }

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
      <div class="container">
  <div class="form">
    <h1 class="text-center mb-4">User List</h1>
    {userData ? (
      <div>
        {userData.map((user) => (
          <div key={user._id} onClick={() => handleUserClick(user._id)} class="mb-3">
            <p class="font-weight-bold text-primary item">{user.email}</p>
            <hr class="my-2 border-primary" />
          </div>
        ))}
      </div>
    ) : (
      <p>No user list available</p>
    )}
  </div>
</div>

    </>
  );
};

export default AllUsersList;
