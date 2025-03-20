const express = require('express');
const Attendance = require('../models/Attendance');
const router = express.Router();

// Route สำหรับบันทึกข้อมูลการเข้า-ออกงาน
router.post('/logAttendance', async (req, res) => {
  const { username, firstName, lastName, loginTime, status } = req.body;

  try {
    const newAttendance = new Attendance({
      username,
      firstName,
      lastName,
      loginTime,
      status,
    });

    await newAttendance.save();
    res.status(201).json({ message: 'บันทึกข้อมูลการเข้า-ออกงานเรียบร้อย' });
  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
  }
});

// Route สำหรับดึงข้อมูลการเข้า-ออกงานทั้งหมด
router.get('/getAttendanceData', async (req, res) => {
  try {
    const attendanceData = await Attendance.find();
    res.json(attendanceData);
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
});

module.exports = router;
