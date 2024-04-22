import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

function AttendanceReport() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // State for user data and pagination
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3; // Number of items per page

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      enqueueSnackbar("Login First", { variant: "success" });
      navigate("/login");
    }
  }, []);

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

  // Pagination logic
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentItems = userData?.record.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="container-sm">
        <h1 className="text-center m-5">Attendance Report</h1>
        {currentItems && currentItems.length > 0 ? (
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
                {currentItems.map((attendanceEntry, index) => (
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
                        <td class="text-primary">
                          {attendanceEntry.signout ? (
                            new Date(
                              attendanceEntry.signout
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            })
                          ) : (
                            <>Pending</>
                          )}
                        </td>
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
                        <td class="text-danger">Absent</td>
                        <td class="text-danger">Absent</td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div class="alert alert-danger text-center" role="alert">
            No attendance data available
          </div>
        )}

        {/* Pagination */}
        <nav aria-label="..." className="m-5">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage - 1)}
              >
                Previous
              </button>
            </li>
            {Array.from(
              { length: Math.ceil(userData?.record.length / pageSize) },
              (_, index) => index + 1
            ).map((pageNumber) => (
              <li
                key={pageNumber}
                className={`page-item ${
                  currentPage === pageNumber ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(pageNumber)}
                >
                  {pageNumber}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === Math.ceil(userData?.record.length / pageSize)
                  ? "disabled"
                  : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => paginate(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default AttendanceReport;
