import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TableNormal = () => {
  const navigate = useNavigate();

  // อ่านข้อมูลจาก session
  const storedUser = JSON.parse(localStorage.getItem('userSession')) || {};
  const { firstName, lastName, loginTime, status } = storedUser;

  // สเตตสำหรับข้อมูลผู้ใช้ทั้งหมด (ที่โหลดจากฐานข้อมูล)
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    // ถ้าข้อมูลไม่ถูกต้องใน session
    if (!firstName || !loginTime) {
      navigate('/');
      return;
    }

    // ดึงข้อมูลการเข้า-ออกงานทั้งหมดจากฐานข้อมูล
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
  }, [firstName, loginTime, navigate]);

  const formatDate = (timeString) => {
    if (!timeString) return '-';
    const dateObj = new Date(timeString);
    const buddhistYear = dateObj.getFullYear() + 543;
    return dateObj.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(dateObj.getFullYear().toString(), buddhistYear.toString());
  };

  const formatTimes = (timeString) => {
    if (!timeString) return '-';
    const dateObj = new Date(timeString);
    return dateObj.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  // กรองข้อมูลการเข้า-ออกงานเฉพาะของผู้ใช้ที่ล็อกอิน
  const filteredData = userData.filter(
    (user) => user.firstName === firstName && user.lastName === lastName
  );

  // เรียงข้อมูลตามวันที่ล่าสุดก่อน
  const sortedData = filteredData.sort((a, b) => new Date(b.loginTime) - new Date(a.loginTime));

  return (
    <Box sx={{ backgroundColor: '#e0f7fa', minHeight: '91vh', py: 4 }}>
      <Button
        variant="contained"
        color="primary"
        sx={{ position: 'absolute', top: 20, left: 20 }}
        onClick={() => navigate(-1)}
      >
        ย้อนกลับ
      </Button>

      {/* Logoบริษัท */}
      <Box sx={{ position: 'absolute', top: -30, right: 50 }}>
        <img
          src="https://www.ircp.co.th/wp-content/uploads/2023/09/IRCP_logo.png"
          alt="IRCP Logo"
          style={{ width: 150, height: 150, objectFit: 'contain' }}
        />
      </Box>

      <Container maxWidth="md">
        <Card sx={{ boxShadow: 5, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" align="center" color="primary" sx={{ fontWeight: 'bold' }}>
              ประวัติการเข้า-ออกงานทั้งหมด
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table size="small" stickyHeader>
                <TableHead sx={{ backgroundColor: '#f1f1f1' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary' }}>ลำดับ</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary' }}>วันที่</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary' }}>สถานะ</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary' }}>เวลาเข้า</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary' }}>เวลาออก</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedData.length > 0 ? (
                    sortedData.map((user, index) => (
                      <TableRow key={index} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f1f1f1' } }}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{formatDate(user.loginTime)}</TableCell>
                        <TableCell>{user.status || '-'}</TableCell>
                        <TableCell>{formatTimes(user.loginTime)}</TableCell>
                        <TableCell>{formatTimes(user.logoutTime)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">ไม่พบข้อมูล</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default TableNormal;
