const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/authRoutes'); 
const attendanceRoutes = require('./routes/attendanceRoutes'); // เพิ่มการใช้งาน route

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/user', attendanceRoutes); // เพิ่ม route สำหรับการบันทึกและดึงข้อมูลการเข้า-ออกงาน

// MongoDB connection
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('MONGO_URI is not defined in the .env file!');
  process.exit(1);  // Exit the process if MONGO_URI is not set
}

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected...');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1); // Exit if the connection to DB fails
});

// Start server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
