const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  loginTime: { type: Date, required: true },
  logoutTime: { type: Date, default: null },  // เวลาออกงาน
  status: { type: String, required: true },   // สถานะ เช่น "ทำงานปกติ", "ลาป่วย"
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
