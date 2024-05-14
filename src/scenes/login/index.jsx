import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, FormControlLabel, Checkbox, Box, Avatar, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Lock, Person } from '@mui/icons-material';

const StyledBox = styled(Box)({
  width: 400,
  height:500,
  margin: 'auto',
  marginTop: '100px',
  padding: '20px',
  borderRadius: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white background
  backdropFilter: 'blur(10px)', // Blur effect for a glassy look
  boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.3)', // Box shadow for depth
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const StyledAvatar = styled(Avatar)({
  width: 100,
  height: 100,
  marginTop:40,
  margin: 'auto',
  backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white background for Avatar
});

const StyledTextField = styled(TextField)({
  width: '100%',
  marginBottom: '35px',
});

const StyledButton = styled(Button)({
  width: '70%',
  height: '50px',
  marginBottom: '20px',
  fontSize:'20px',
  fontFamily: 'inherit',
  backgroundColor: 'green', 
  color: 'white',
  borderRadius: '20px',
  '&:hover': {
    backgroundColor: '#1e5245', 
  },
});



const ErrorBox = styled(Box)({
  textAlign: 'center',
  color: 'red',
  marginBottom: '10px',
});

const AdminLogin = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const adminId = data._id;
        const adminName = data.username;
        console.log('Login successful:', adminName);

        

        onLoginSuccess(adminName);
        navigate('/'); 
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Internal server error');
    }
  };

  return (
    <StyledBox>
      <StyledAvatar alt="User Avatar" src="../../assets/use.png" />
      <Typography variant="h5" style={{ color: 'black', marginBottom: '50px', fontSize: '40px' }}>Admin Login</Typography>
      <StyledTextField
        label="Admin Name"
        type="text"
        value={username}
        onChange={(e) => setusername(e.target.value)}
        InputProps={{
          startAdornment: <Person style={{ color: 'white' }} />,
        }}
      />
      <StyledTextField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          startAdornment: <Lock style={{ color: 'white' }} />,
        }}
      />
     
      <StyledButton variant="contained" onClick={handleLogin}>LOGIN</StyledButton>
      {error && <ErrorBox>{error}</ErrorBox>}
    </StyledBox>
  );
};

export default AdminLogin;
