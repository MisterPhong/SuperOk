import { Box, Paper, Typography, TextField, Button } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [position, setPosition] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!username || !password || !firstName || !lastName || !position) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, firstName, lastName, position })
    });

    const data = await response.json();
    if (response.ok) {
      alert('ลงทะเบียนสำเร็จ');
      navigate('/login');
    } else {
      alert(data.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right,rgb(136, 222, 251),rgb(247, 247, 247))',
      }}
    >
      <Paper sx={{ padding: 4, width: 400, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" color="primary" align="center" mb={3}>
          ลงทะเบียน
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="ชื่อ"
            margin="normal"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            fullWidth
            label="สกุล"
            margin="normal"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            fullWidth
            label="ตำแหน่ง"
            margin="normal"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
          <TextField
            fullWidth
            label="ชื่อผู้ใช้งาน"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            label="รหัสผ่าน"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
            ลงทะเบียน
          </Button>
        </form>
        <Typography align="center" mt={2}>
          มีบัญชีอยู่แล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
