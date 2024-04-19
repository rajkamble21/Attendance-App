const express = require("express");
const mongoose = require("mongoose");
const attendanceRoute = require("./routes/attendance.route");
const authRoute = require("./routes/auth.route")
const Attendance = require('./models/attendance.model');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'this_is_the_secret_key_for_jwt';
const cors = require('cors');


const app = express();

const PORT = 4000;

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.json({"message":"Server Started"});
});

app.use('/v1', attendanceRoute);
app.use('/v1', authRoute);





// app.get('/v1/attendance/allusers', verifyToken, async (req, res) => {
//     try {
//         const attendanceData = await Attendance.find();
//         res.json(attendanceData);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// })


// app.patch('/v1/attendance/:id', verifyToken, async(req, res)=>{
//     try {
//         const { id } = req.params;
//         const updatedAttendance = await Attendance.findByIdAndUpdate(id, req.body, { new: true });
//         res.json(updatedAttendance);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// })

// app.post('/v1/attendance/signin/:id', verifyToken, async(req, res)=>{
//     const {id} = req.params;
//     try{
//         const userAttendance = await Attendance.findById(id);
//         if (!userAttendance) {
//             return res.status(404).json({ message: 'User not found' });
//           }
//         userAttendance.record.push({
//         signin: new Date(),
//         });
//         await userAttendance.save();
//         res.status(201).json({ message: 'Signed in successfully' });
//     }catch (error){
//         console.error(error);
//         res.status(500).json({"message":"server error"})
//     }
// });


// app.post('/v1/attendance/signout/:id', verifyToken, async(req, res)=>{
//     const {id} = req.params;
//     try{
//         const userAttendance = await Attendance.findById(id);
//         if(!userAttendance){
//             return res.status(404).json({ message: 'User not found' });
//         }
//         const latestReport = userAttendance.record[userAttendance.record.length - 1];
//         latestReport.signout = new Date();
//         await userAttendance.save();
//         res.status(200).json({ message: 'Signed out successfully' });
//     }catch(error){
//         console.error(error);
//         res.status(500).json({"message":"server error"})
//     }
// });





const URL = "mongodb://localhost:27017/attendance";

app.listen(PORT, async () => {
    try {
        await mongoose.connect(URL);
        console.log(`Database connected`);
        console.log(`Server is running at http://localhost:${PORT}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
});
