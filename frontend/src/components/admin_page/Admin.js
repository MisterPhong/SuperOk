import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/th';

const TimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs()); // อัปเดตเวลาใหม่ทุกๆ วินาที
    }, 1000);

    return () => clearInterval(interval); // เคลียร์ interval เมื่อคอมโพเนนต์ถูก unmount
  }, []);

  const dayOfWeek = currentTime.format('dddd'); // วันในสัปดาห์ (ภาษาไทย)
  const dayOfMonth = currentTime.format('D'); // วันที่
  const month = currentTime.format('MMMM'); // เดือน (ภาษาไทย)
  const year = currentTime.year() + 543; // ปีพุทธศักราช
  const time = currentTime.format('HH:mm:ss'); // เวลา

  // แปลงชื่อวันและเดือนเป็นภาษาไทย
  const dayOfWeekTh = {
    'Sunday': 'อาทิตย์',
    'Monday': 'จันทร์',
    'Tuesday': 'อังคาร',
    'Wednesday': 'พุธ',
    'Thursday': 'พฤหัสบดี',
    'Friday': 'ศุกร์',
    'Saturday': 'เสาร์',
  };

  const monthTh = {
    'January': 'มกราคม',
    'February': 'กุมภาพันธ์',
    'March': 'มีนาคม',
    'April': 'เมษายน',
    'May': 'พฤษภาคม',
    'June': 'มิถุนายน',
    'July': 'กรกฎาคม',
    'August': 'สิงหาคม',
    'September': 'กันยายน',
    'October': 'ตุลาคม',
    'November': 'พฤศจิกายน',
    'December': 'ธันวาคม',
  };

  return (
    <Box
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',

        py: 1,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0b4999', marginBottom: 2 }}>
        ยินดีต้อนรับ Admin
      </Typography>
      <Typography variant="body1" sx={{ color: '#555', fontSize: '1.2rem' }}>
        สวัสดีวัน <span style={{ fontWeight: 'bold' }}>{dayOfWeekTh[dayOfWeek]}</span> ที่ <span style={{ fontWeight: 'bold' }}>{dayOfMonth}</span> {monthTh[month]} พ.ศ. <span style={{ fontWeight: 'bold' }}>{year}</span> เวลา <span style={{ fontWeight: 'bold' }}>{time}</span>
      </Typography>
    </Box>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('userSession')) || {};
  const { firstName, nickname, loginTime, status } = storedUser;
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateMenuAnchorEl, setDateMenuAnchorEl] = useState(null);
  const [statusMenuAnchorEl, setStatusMenuAnchorEl] = useState(null);

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isAdminLoggedIn) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/getAttendanceData');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn'); // ลบสถานะการล็อกอินของ Admin
    localStorage.removeItem('userSession'); // ลบข้อมูล session ของผู้ใช้
    navigate('/Login'); // นำทางไปยังหน้า Login
  };

  const handleOpenDateMenu = (event) => {
    setDateMenuAnchorEl(event.currentTarget);
  };

  const handleCloseDateMenu = () => {
    setDateMenuAnchorEl(null);
  };

  const handleOpenStatusMenu = (event) => {
    setStatusMenuAnchorEl(event.currentTarget);
  };

  const handleCloseStatusMenu = () => {
    setStatusMenuAnchorEl(null);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setDateMenuAnchorEl(null);
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    handleCloseStatusMenu();
  };

  const filteredData = userData.filter(user => {
    const loginDate = new Date(user.loginTime).toDateString();
    const selectedDateString = selectedDate ? selectedDate.toDate().toDateString() : null;
    const dateFilter = selectedDate ? loginDate === selectedDateString : true;
    const statusFilterCondition = statusFilter === '' || (user.status && user.status === statusFilter);
    const nameFilter = searchTerm === '' ||
      (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()));

    return dateFilter && statusFilterCondition && nameFilter;
  });

  return (
    <Box
      sx={{
        minHeight: "91vh",
        width: "99vw",
        overflow: "hidden",
        background: 'linear-gradient(to bottom right, rgba(254, 255, 255, 0.81), rgb(136, 222, 251))',
        py: 4,
        position: 'relative',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 50,
          zIndex: 1000,
        }}
      >
        <img
          src="https://www.ircp.co.th/wp-content/uploads/2023/09/IRCP_logo.png"
          alt="IRCP Logo"
          style={{ width: 150, height: 80, objectFit: 'contain' }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ marginTop: '80px' }}>
        <Card sx={{ mb: 4, boxShadow: 4, width: '100%', maxWidth: '100%', padding: 3 }}>
          <CardContent>
            <Typography variant="h5" align="center" color='#0b4999' gutterBottom>
              Admin
            </Typography>

            <TimeDisplay /> {/* เรียกใช้ TimeDisplay ที่นี่ */}

          </CardContent>
        </Card>

        <Card sx={{ boxShadow: 4, width: '100%', maxWidth: '100%', padding: 3 }}>
          <CardContent>
            <Typography variant="h6" color="primary" gutterBottom>
              ประวัติการเข้า-ออกงาน (นักศึกษาฝึกงาน)
            </Typography>

            {/* ช่องค้นหา */}
            <TextField
              fullWidth
              label="ค้นหาชื่อ"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TableContainer component={Paper} sx={{ maxHeight: 400, borderRadius: '8px' }}>
              <Table size="small" stickyHeader>
                <TableHead sx={{ backgroundColor: '#00acc1' }}>
                  <TableRow sx={{ '& th': { backgroundColor: '#00acc1', color: 'white', fontWeight: 'bold' } }}>
                    <TableCell>ลำดับ</TableCell>
                    <TableCell>
                      วันที่
                      <IconButton size="small" onClick={handleOpenDateMenu}>
                        <FilterListIcon />
                      </IconButton>
                      <Menu anchorEl={dateMenuAnchorEl} open={Boolean(dateMenuAnchorEl)} onClose={handleCloseDateMenu}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            renderInput={(params) => null}
                          />
                        </LocalizationProvider>
                      </Menu>
                    </TableCell>
                    <TableCell>ชื่อ</TableCell>
                    <TableCell>นามสกุล</TableCell>
                    <TableCell>
                      สถานะ
                      <IconButton size="small" onClick={handleOpenStatusMenu}>
                        <FilterListIcon />
                      </IconButton>
                      <Menu
                        anchorEl={statusMenuAnchorEl}
                        open={Boolean(statusMenuAnchorEl)}
                        onClose={handleCloseStatusMenu}
                      >
                        <MenuItem onClick={() => handleFilterChange('')}>ทั้งหมด</MenuItem>
                        <MenuItem onClick={() => handleFilterChange('ทำงานปกติ')}>ทำงานปกติ</MenuItem>
                        <MenuItem onClick={() => handleFilterChange('ลาป่วย')}>ลาป่วย</MenuItem>
                        <MenuItem onClick={() => handleFilterChange('ลากิจ')}>ลากิจ</MenuItem>
                      </Menu>
                    </TableCell>
                    <TableCell>เวลาเข้างาน</TableCell>
                    <TableCell>เวลาออกงาน</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((user, index) => (
                      <TableRow key={index} >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{new Date(user.loginTime).toLocaleDateString('th-TH')}</TableCell>
                        <TableCell>{user.firstName}</TableCell>
                        <TableCell>{user.lastName}</TableCell>
                        <TableCell>{user.status || '-'}</TableCell>
                        <TableCell>
                          {new Date(user.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </TableCell>
                        <TableCell>
                          {user.logoutTime
                            ? new Date(user.logoutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">ไม่มีข้อมูล</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>


        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            ออกจากระบบ
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Admin;
