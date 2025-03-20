// Dashboard.js
import { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function DashboardX() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem('userSession');
    if (!session) {
      navigate('/login');
    } else {
      setUser(JSON.parse(session));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Box sx={{ p: 4 }}>
      {user && (
        <>
          <Typography variant="h5">สวัสดี {user.firstName} {user.lastName}</Typography>
          <Typography>ตำแหน่ง: {user.position}</Typography>
          <Typography>สถานะ: {user.status}</Typography>
          <Typography>เวลาเช็คอิน: {new Date(user.loginTime).toLocaleString()}</Typography>
          <Button sx={{ mt: 2 }} variant="contained" color="secondary" onClick={handleLogout}>ออกจากระบบ</Button>
        </>
      )}
    </Box>
  );
}
