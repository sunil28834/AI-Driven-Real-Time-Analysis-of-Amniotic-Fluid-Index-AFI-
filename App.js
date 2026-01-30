import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import LandingPage from './components/LandingPage';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import AppointmentPage from './components/AppointmentPage';
import PractoIntegration from './components/PractoIntegration';
import DoctorSchedule from './components/DoctorSchedule';
import PatientRecords from './components/PatientRecords';
import AnalysisHistory from './components/AnalysisHistory';
import Reports from './components/Reports';
import HealthRecords from './components/HealthRecords';
import MedicalHistory from './components/MedicalHistory';
import Settings from './components/Settings';
import Layout from './components/Layout';
import authService from './services/authService';
import RefVideos from './components/RefVideos';
import Tips from "./components/Tips";
import Doctors from "./components/Doctors";
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32',
    },
    secondary: {
      main: '#4CAF50',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const PrivateRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const profile = await authService.getUserProfile();
        setUserDetails(profile || user);
      } catch (error) {
        setUserDetails(user);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  if (!user) return <Navigate to="/auth" />;
  if (loading) return <div>Loading...</div>;
  
  return (
    <Layout userDetails={userDetails}>
      {children}
    </Layout>
  );
};

const DashboardRoute = () => {
  const [userRole, setUserRole] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    const fetchUserRole = async () => {
      const user = authService.getCurrentUser();
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const profile = await authService.getUserProfile();
        setUserRole(profile.role);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserRole();
  }, []);
  
  const user = authService.getCurrentUser();
  if (!user) return <Navigate to="/auth" />;
  if (loading) return <div>Loading...</div>;
  
  return userRole === 'doctor' ? <DoctorDashboard /> : <PatientDashboard />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardRoute />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/appointments" 
            element={
              <PrivateRoute>
                <AppointmentPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/external-booking" 
            element={
              <PrivateRoute>
                <PractoIntegration />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/schedule" 
            element={
              <PrivateRoute>
                <DoctorSchedule />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/patient-records" 
            element={
              <PrivateRoute>
                <PatientRecords />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/analysis-history" 
            element={
              <PrivateRoute>
                <AnalysisHistory />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/health-records" 
            element={
              <PrivateRoute>
                <HealthRecords />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/medical-history" 
            element={
              <PrivateRoute>
                <MedicalHistory />
              </PrivateRoute>
            } 
          />
          <Route 
  path="/reference-videos"
  element={
    <PrivateRoute>
      <RefVideos />
    </PrivateRoute>
  }
/>
<Route 
  path="/health-tips"
  element={
    <PrivateRoute>
      <Tips />
    </PrivateRoute>
  }
/>
<Route 
  path="/doctors"
  element={
    <PrivateRoute>
      <Doctors />
    </PrivateRoute>
  }
/>
          <Route 
            path="/settings" 
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
