import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

function AttendanceReport() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      enqueueSnackbar("Login First", { variant: "success" });
      navigate("/login");
    }
  }, []);

  const [userData, setUserData] = useState(null);
  let token = localStorage.getItem("token");
  let userId = localStorage.getItem("userId");
  let selectedUserId = localStorage.getItem("selectedUserId");

  if (selectedUserId) {
    userId = selectedUserId;
  }

  useEffect(() => {
    const fetchAttendanceData = async () => {
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
      <div class="container">
        <div class="form">
          <h1 class="text-center mb-4">Attendance Report</h1>
          {userData && userData.record.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
              <thead className="thead-dark">
            <tr>
              <th>Date</th>
              <th>Sign In</th>
              <th>Sign Out</th>
            </tr>
          </thead>
          <tbody>
                {userData.record.map((attendanceEntry, index) => (
                  <>
                    {attendanceEntry.ispresent ? (
                      <tr key={index} class="bg-light">
                        <td class="text-primary">
                          {new Date(attendanceEntry.signin).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td class="text-primary">
                          Sign In -{" "}
                          {new Date(attendanceEntry.signin).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            }
                          )}
                        </td>
                        {attendanceEntry.signout && (
                          <td class="text-primary">
                            Sign Out -{" "}
                            {new Date(
                              attendanceEntry.signout
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            })}
                          </td>
                        )}
                      </tr>
                    ) : (
                      <tr class="bg-light">
                        <td class="text-danger">
                          {new Date(attendanceEntry.date).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td class="text-danger">Sign In - Absent</td>
                        <td class="text-danger">Sign Out - Absent</td>
                      </tr>
                    )}
                  </>
                ))}
                </tbody>
              </table>
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
