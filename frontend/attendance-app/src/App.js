import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./components/Login";
import Register from "./components/Register";
import Report from "./components/Report";
import Attendance from "./components/Attendance";
import AttendanceReport from "./components/AttendanceReport";
import AllUsersList from "./components/AllUsersList";
import "./App.css"

function App() {
  return (
      <Router>
          <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/report" element={<Report />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/attendancereport" element={<AttendanceReport />} />
          <Route path="/alluserslist" element={<AllUsersList />} />
        </Routes>
      </div>
      </Router>
  );
}

export default App;

