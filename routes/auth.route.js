const express = require("express");
const Attendance = require('../models/attendance.model');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'this_is_the_secret_key_for_jwt';

const router = express.Router();

router.post('/auth/register', async(req, res)=>{
    try {
        const newAttendance = new Attendance(req.body);
        const savedAttendance = await newAttendance.save();
        res.status(201).json(savedAttendance);
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            if (error.keyPattern.username) {
                return res.status(409).json({ message: "Username already exists" });
            }else if (error.keyPattern.password) {
                return res.status(409).json({ message: "Password already exists" });
            } else if (error.keyPattern.email) {
                return res.status(409).json({ message: "Email already exists" });
            }
        }
        res.status(400).json({ message: error.message });
    }
})

router.post('/auth/login', async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Attendance.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email" });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ username: user.username, _id: user._id, isadmin: user.isadmin }, JWT_SECRET);
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;