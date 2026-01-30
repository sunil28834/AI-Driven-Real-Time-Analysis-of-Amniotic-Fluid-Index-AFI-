import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import {
  Person,
  Security,
  Notifications,
  Palette,
  Save
} from '@mui/icons-material';
import authService from '../services/authService';

const Settings = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    role: '',
    specialization: ''
  });
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      analysis: true
    },
    privacy: {
      shareData: false,
      analytics: true
    },
    appearance: {
      darkMode: false,
      compactView: false
    }
  });
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = authService.getCurrentUser();
        const profile = await authService.getUserProfile();
        const userData = profile || user;
        setUserDetails(userData);
        setProfileData({
          full_name: userData?.full_name || '',
          email: userData?.email || '',
          role: userData?.role || '',
          specialization: userData?.specialization || ''
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        const user = authService.getCurrentUser();
        if (user) {
          setUserDetails(user);
          setProfileData({
            full_name: user.full_name || '',
            email: user.email || '',
            role: user.role || '',
            specialization: ''
          });
        }
      }
    };
    
    fetchUserData();
  }, []);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // Mock save functionality
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const settingSections = [
    {
      title: 'Profile Settings',
      icon: <Person />,
      color: '#2E7D32',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={profileData.full_name}
              onChange={(e) => setProfileData(prev => ({...prev, full_name: e.target.value}))}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              value={profileData.email}
              variant="outlined"
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Role"
              value={profileData.role}
              variant="outlined"
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Specialization"
              value={profileData.specialization}
              onChange={(e) => setProfileData(prev => ({...prev, specialization: e.target.value}))}
              placeholder="Enter your specialization"
              variant="outlined"
            />
          </Grid>
        </Grid>
      )
    },
    {
      title: 'Notifications',
      icon: <Notifications />,
      color: '#1976D2',
      content: (
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications.email}
                onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
              />
            }
            label="Email notifications for new analyses"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications.push}
                onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
              />
            }
            label="Push notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications.analysis}
                onChange={(e) => handleSettingChange('notifications', 'analysis', e.target.checked)}
              />
            }
            label="Analysis completion alerts"
          />
        </Box>
      )
    },
    {
      title: 'Privacy & Security',
      icon: <Security />,
      color: '#ED6C02',
      content: (
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={settings.privacy.shareData}
                onChange={(e) => handleSettingChange('privacy', 'shareData', e.target.checked)}
              />
            }
            label="Share anonymized data for research"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.privacy.analytics}
                onChange={(e) => handleSettingChange('privacy', 'analytics', e.target.checked)}
              />
            }
            label="Allow usage analytics"
          />
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" color="warning">
              Change Password
            </Button>
          </Box>
        </Box>
      )
    },
    {
      title: 'Appearance',
      icon: <Palette />,
      color: '#9C27B0',
      content: (
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={settings.appearance.darkMode}
                onChange={(e) => handleSettingChange('appearance', 'darkMode', e.target.checked)}
              />
            }
            label="Dark mode"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.appearance.compactView}
                onChange={(e) => handleSettingChange('appearance', 'compactView', e.target.checked)}
              />
            }
            label="Compact view"
          />
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', p: 4, maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 4 }}>
        Settings
      </Typography>

      {saveMessage && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {saveMessage}
        </Alert>
      )}

      <Grid container spacing={4}>
        {settingSections.map((section, index) => (
          <Grid item xs={12} key={index}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    bgcolor: `${section.color}15`,
                    color: section.color,
                    mr: 2
                  }}>
                    {section.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {section.title}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                {section.content}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={handleSaveSettings}
          startIcon={<Save />}
          sx={{
            py: 1.5,
            px: 4,
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: 2,
            bgcolor: '#2E7D32',
            '&:hover': { bgcolor: '#1B5E20' },
            textTransform: 'none'
          }}
        >
          Save Settings
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;