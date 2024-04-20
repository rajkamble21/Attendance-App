const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  ispresent: {
    type: Boolean,
    default: false,
  },
  signin: {
    type: Date,
  },
  signout: {
    type: Date,
  },
});

const attendanceSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: false,
  },
  ispresent: {
    type: Boolean,
    default: false,
  },
  isadmin: {
    type: Boolean,
    default: false,
  },
  record: {
    type: [reportSchema],
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
