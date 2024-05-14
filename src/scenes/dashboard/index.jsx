import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import ReservationIcon from "@mui/icons-material/Receipt";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";

import { useState, useEffect } from "react";
import { ImageOutlined } from "@mui/icons-material";

const Dashboard = ({}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [totalSales, setTotalSales] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [totalRes, setTotalRes] = useState(0);

  const [recentReservations, setRecentReservations] = useState([]);
  
  const fetchCommand = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/commande');
      const comments = await response.json();

      const totalSales = comments.reduce((acc, curr) => acc + curr.price, 0);
      setTotalSales(totalSales);      

      const res = new Set(comments.map(comments => comments._id));
      setTotalRes(res.size)
      setRecentReservations(comments);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchCommand();
  }, []);

  const fetchusers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const users = await response.json();
     

      const user = new Set(users.map(r => r._id));
      setTotalClients(user.size)
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchusers();
  }, []);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalRes}
            subtitle="Total Orders"
            progress="0.75"
            increase="+14%"
            icon={
              <ReservationIcon
                sx={{ color: colors.blueAccent[100], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalClients}
            subtitle="Total Clients"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.blueAccent[100], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${totalSales.toFixed(2)} DT`}
            subtitle="Total Revenue"
            progress="0.75"
            increase="+14%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.blueAccent[100], fontSize: "26px" }}
              />
            }
          />
        </Box>
       
        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
          <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.blueAccent[100]}
              >
                {totalSales} DT
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Orders
            </Typography>
          </Box>
          {recentReservations.map((comments, i) => (
            <Box
              key={`${comments._id}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                 Username: {comments.name}
                </Typography>
                <Typography color={colors.grey[100]}>
                 Product: {comments.productName}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>Total: {comments.price} Dt</Box>
            </Box>
            
          ))}
        </Box>
       
      </Box>
    </Box>
    
  );
};

export default Dashboard;
