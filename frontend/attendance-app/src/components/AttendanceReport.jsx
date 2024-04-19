import React, { useState, useEffect } from "react";
import axios from "axios";

function AttendanceReport() {
  const [userData, setUserData] = useState(null);
  let token = localStorage.getItem("token");
  let userId = localStorage.getItem("userId");
  let selectedUserId = localStorage.getItem("selectedUserId");

  if(selectedUserId){
    userId = selectedUserId;
  }

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/v1/attendance/getuser/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, []);



  useEffect(() => {
    return () => {
      localStorage.removeItem("selectedUserId");
    };
  }, []);


  return (
    <>
      <div className="container">
        <div className="form">
          <h1>Attendance Report</h1>
          {userData && userData.record.length > 0 ? (
            <div>
              {userData.record.map((attendanceEntry, index) => (
                <div key={index}>
                  <p>{new Date(attendanceEntry.signin).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                  <p>Sign In - {new Date(attendanceEntry.signin).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</p>
                  {attendanceEntry.signout && (
                    <p>Sign Out - {new Date(attendanceEntry.signout).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</p>
                  )}
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
}

export default AttendanceReport;