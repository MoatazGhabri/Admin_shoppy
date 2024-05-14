import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Button, Modal, TextField, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modifiedUserData, setModifiedUserData] = useState({});

  const columns = [
    { field: "_id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      
    },
    {
      field: "lastName",
      headerName: "last Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    
    {
      field: "modify",
      headerName: "Modify",
      flex: 1,
      renderCell: ({ row }) => (
        <Button
          onClick={() => handleModify(row)}
          variant="outlined"
          color="success"
        >
          Modify
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 1,
      renderCell: ({ row }) => (
        <Button
          onClick={() => handleDelete(row)}
          variant="outlined"
          color="error"
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleModify = (row) => {
    setSelectedUser(row);
    setModifiedUserData({ ...row });
    setOpenModal(true);
  };

  const handleDelete = async (row) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${row._id}`);
      setUsers(users.filter(user => user._id !== row._id));

    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedUser(null);
    setModifiedUserData({});
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/${selectedUser._id}`, modifiedUserData);
      setOpenModal(false);
      setUsers(users.map(user => user._id === selectedUser._id ? modifiedUserData : user));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        const usersWithId = response.data.map((user, index) => ({ ...user, id: index.toString() }));
        setUsers(usersWithId);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Box m="20px">
      <Header title="Users" subtitle="Managing Users" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.greenAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.greenAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.blueAccent[200]} !important`,
          },
        }}
      >
        <DataGrid rows={users} columns={columns} />
      </Box>
      <Modal open={openModal} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            minWidth: 400,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={handleModalClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="h6" gutterBottom>
            Modify User Data
          </Typography>
          
          <TextField
            label="Name"
            value={modifiedUserData.name || ''}
            onChange={(e) => setModifiedUserData({ ...modifiedUserData, name: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
        <TextField
            label="Last Name"
            value={modifiedUserData.lastName || ''}
            onChange={(e) => setModifiedUserData({ ...modifiedUserData, lastName: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
         
          <TextField
            label="Email"
            value={modifiedUserData.email || ''}
            onChange={(e) => setModifiedUserData({ ...modifiedUserData, email: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button onClick={handleSaveChanges} variant="contained" color="success">
            Save Changes
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Team;
