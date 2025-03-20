const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// REGISTER (พร้อม hash)
router.post('/register', async (req, res) => {
  console.log('Request Body:', req.body); // log ข้อมูลที่รับจาก frontend
  const { username, password, firstName, lastName, position } = req.body;

  if (!username || !password || !firstName || !lastName || !position) {
    console.log('❌ ข้อมูลไม่ครบ');
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('❌ username ซ้ำ');
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, firstName, lastName, position });
    await user.save();

    console.log('✅ ลงทะเบียนสำเร็จ');
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// LOGIN (พร้อม JWT)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: 'ไม่พบผู้ใช้งาน' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.json({
    token,
    user: {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      position: user.position
    }
  });
});

module.exports = router;
