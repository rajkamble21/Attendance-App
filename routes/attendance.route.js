
const express = require("express");
const verifyToken = require('../middlewares/token');
const verifyAdmin = require('../middlewares/admin');
const Attendance = require('../models/attendance.model');
const cron = require('node-cron');


const router = express.Router();




cron.schedule('59 23 * * *', async () => {
    try {
        const users = await Attendance.find();

        const today = new Date().toISOString().split('T')[0];

        console.log(today);

        users.forEach(async (user) => {
            const existingReport = user.record.find(report => report.signin && report.signin.toISOString().split('T')[0] === today);

            if (!existingReport) {
                user.record.push({
                    signin: null,
                    signout: null,
                    ispresent: false,
                });
                await user.save();
            }
        });
    } catch (error) {
        console.error(error);
    }
}, {
    scheduled: true, 
    timezone: 'Asia/Kolkata' 
});


router.get('/attendance/absentee', async (req, res) => {
    try {
        // Manually trigger the cron job to run immediately
        cron.schedule('* * * * *', async () => {
            try {
                const users = await Attendance.find();
                const today = new Date().toISOString().split('T')[0];

                users.forEach(async (user) => {
                    const existingReport = user.record.find(report => report.signin && report.signin.toISOString().split('T')[0] === today);

                    if (!existingReport) {
                        user.record.push({
                            signin: null,
                            signout: null,
                            ispresent: false,
                        });
                        await user.save();
                    }
                });

                console.log('Cron job executed immediately');
                res.status(200).json({ message: 'Cron job executed immediately' });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error executing cron job' });
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error triggering cron job' });
    }
});





router.get('/attendance/allusers', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const attendanceData = await Attendance.find();
        res.json(attendanceData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/attendance/getuser/:id', verifyToken, async (req, res)=>{
    const {id} = req.params;
    const userAttendance = await Attendance.findById(id);
    if (!userAttendance) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(userAttendance);
})

router.post('/attendance/signin/:id', verifyToken, async(req, res) => {
    const { id } = req.params;
    try {
        const userAttendance = await Attendance.findById(id);
        if (!userAttendance) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find today's report, if it exists
        const today = new Date().toISOString().split('T')[0]; // Get today's date in ISO format (YYYY-MM-DD)
        const existingReport = userAttendance.record.find(report => report.signin.toISOString().split('T')[0] === today);

        // Update or create a new report for today
        if (existingReport) {
            existingReport.signin = new Date();
            existingReport.ispresent = true;
        } else {
            userAttendance.record.push({
                signin: new Date(),
                ispresent: true,
            });
        }

        userAttendance.ispresent = true;

        await userAttendance.save();
        res.status(201).json({ message: 'Signed in successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/attendance/signout/:id', verifyToken, async(req, res) => {
    const { id } = req.params;
    try {
        const userAttendance = await Attendance.findById(id);
        if (!userAttendance) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find today's report, if it exists
        const today = new Date().toISOString().split('T')[0]; // Get today's date in ISO format (YYYY-MM-DD)
        const existingReport = userAttendance.record.find(report => report.signout === null || report.signin.toISOString().split('T')[0] === today);

        // Update the signout time for today's report
        if (existingReport) {
            existingReport.signout = new Date();
        } else {
            // If there's no existing sign-in for today, return an error
            return res.status(400).json({ message: 'No sign-in found for today' });
        }
        userAttendance.ispresent = false;
        await userAttendance.save();
        res.status(200).json({ message: 'Signed out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;