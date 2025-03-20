import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const requiredLocation = {
  lat: 16.251035398712936,
  lon: 103.25288661528052, // ออฟฟิศ
};

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [checkedDashboard, setCheckedDashboard] = useState('');
  const [checkedIsWorking, setCheckedIsWorking] = useState(false);
  const [isLocationValid, setIsLocationValid] = useState(true);
  const navigate = useNavigate();

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const checkLocation = useCallback((position) => {
    const { latitude, longitude } = position.coords;
    const distance = getDistance(latitude, longitude, requiredLocation.lat, requiredLocation.lon);
    setIsLocationValid(distance <= 1);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      alert('กรุณากรอก Username และ Password');
      return;
    }

    if (username === 'Admin' && password === 'Admin') {
      // สำหรับ Admin ทำการเข้าสู่ระบบโดยไม่ต้องใช้ Checkbox
      const currentLoginTime = new Date().toISOString();
      const sessionData = {
        username: 'Admin',
        firstName: 'Admin',
        lastName: 'Admin',
        position: 'Admin',
        status: 'admin', // สถานะสำหรับ Admin
        loginTime: currentLoginTime,
      };

      localStorage.setItem('userSession', JSON.stringify(sessionData));
      localStorage.setItem('isAdminLoggedIn', true); // Set admin login status

      // นำทางไปหน้า Admin โดยตรง
      navigate('/admin');
      return;
    }

    try {
      // ตรวจสอบข้อมูลการล็อกอินสำหรับผู้ใช้ปกติ
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
        return;
      }

      // บันทึกข้อมูลการเข้าสู่ระบบ
      const currentLoginTime = new Date().toISOString();
      const sessionData = {
        username: data.user.username,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        position: data.user.position,
        status: checkedDashboard, // ส่งสถานะ
        loginTime: currentLoginTime, // ส่งเวลาเข้า
      };

      localStorage.setItem('userSession', JSON.stringify(sessionData));

      // ส่งข้อมูลเวลาเข้า-ออก ไปยังฐานข้อมูลใหม่
      await fetch('http://localhost:5000/api/user/logAttendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.user.username,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          loginTime: currentLoginTime,
          status: checkedDashboard,
        }),
      });

      // นำทางไปยังหน้า Dashboard ตามสถานะ
      if (checkedDashboard === 'ทำงานปกติ') navigate('/dashboard');
      else if (checkedDashboard === 'ลาป่วย') navigate('/dashboard1');
      else if (checkedDashboard === 'ลากิจ') navigate('/dashboard2');

    } catch (error) {
      console.error('Error:', error);
      alert('มีปัญหาจากระบบในการลงชื่อเข้าใช้');
    }
  };

  useEffect(() => {
    const session = localStorage.getItem('userSession');
    if (session) {
      const data = JSON.parse(session);
      if (data.status === 'ทำงานปกติ') navigate('/dashboard');
      else if (data.status === 'ลาป่วย') navigate('/dashboard1');
      else if (data.status === 'ลากิจ') navigate('/dashboard2');
      else if (data.status === 'admin') navigate('/admin'); // สำหรับ Admin
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(checkLocation, (error) => {
        console.error(error);
        setIsLocationValid(false);
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
      setIsLocationValid(false);
    }
  }, [navigate, checkLocation]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right,rgb(136, 222, 251),rgb(247, 247, 247))',
        position: 'relative',
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(-1)}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
        }}
      >
        ย้อนกลับ
      </Button>

      <Box sx={{ position: 'absolute', top: 16 }}>
        <img
          src="https://www.ircp.co.th/wp-content/uploads/2023/09/IRCP_logo.png"
          alt="IRCP Logo"
          style={{ width: 200, height: 200, objectFit: 'contain' }}
        />
      </Box>

      <Container maxWidth="sm">
        <Card sx={{ boxShadow: 5, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 2 }} color='#0b4999'>
              ลงชื่อเข้างาน
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Box>
                <FormControlLabel
                  control={<Checkbox checked={checkedDashboard === 'ทำงานปกติ'} onChange={() => { setCheckedDashboard('ทำงานปกติ'); setCheckedIsWorking(true); }} />}
                  label="ทำงานปกติ"
                />
                <FormControlLabel
                  control={<Checkbox checked={checkedDashboard === 'ลาป่วย'} onChange={() => { setCheckedDashboard('ลาป่วย'); setCheckedIsWorking(false); }} />}
                  label="ลาป่วย"
                />
                <FormControlLabel
                  control={<Checkbox checked={checkedDashboard === 'ลากิจ'} onChange={() => { setCheckedDashboard('ลากิจ'); setCheckedIsWorking(false); }} />}
                  label="ลากิจ"
                />
              </Box>

              {checkedIsWorking && !isLocationValid && <Alert severity="error">คุณต้องอยู่ในรัศมี 1 กิโลเมตรจากออฟฟิศ ถึงจะเช็คอินเข้างานได้</Alert>}

              <Button type="submit" variant="contained" fullWidth>
                เข้างาน
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 1 }}
                onClick={() => navigate('/reg')}
              >
                ยังไม่มีบัญชี? ลงทะเบียนที่นี่
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
