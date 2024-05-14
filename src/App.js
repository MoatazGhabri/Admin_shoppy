import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Topbar from './scenes/global/Topbar';
import Sidebar from './scenes/global/Sidebar';
import Dashboard from './scenes/dashboard';
import Team from './scenes/team';
import Products from './scenes/Products';
import Form from './scenes/form';
import Line from './scenes/line';
import ProductForm from './scenes/ProductForm';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from './theme';
import AdminLogin from './scenes/login';
import Orders from './scenes/Orders';
function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminName, setAdminName] = useState(''); // State to store admin name
  const handleLoginSuccess = (adminName) => {
    setIsLoggedIn(true);
    setAdminName(adminName); // Set admin name when login is successful
  };
  const handleLogout = () => {
    // Perform logout actions here, such as clearing user data and updating state
    setIsLoggedIn(false);
    setAdminName('');

  };
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!isLoggedIn && <AdminLogin onLoginSuccess={handleLoginSuccess} />}
          {isLoggedIn && (
            <>
              <Sidebar isSidebar={isSidebar}  adminName={adminName}/>
              <main className="content">
              <Topbar setIsSidebar={setIsSidebar} adminName={adminName} onLogout={handleLogout} />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/orders" element={<Orders  />} />
                  <Route path="/form" element={<Form />} />
                  <Route path="/productForm" element={<ProductForm/>}  />
                  <Route path="/line" element={<Line />} />
                 
    
                </Routes>
              </main>
            </>
          )}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
