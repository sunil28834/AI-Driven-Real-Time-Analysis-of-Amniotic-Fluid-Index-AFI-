import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Schedule,
  People,
  History,
  Assessment,
  LocalHospital,
  Settings,
  AccountCircle,
  Notifications,
  ExitToApp,
  Person,
  Help,
  NavigateNext
} from '@mui/icons-material';
import authService from '../services/authService';

const drawerWidth = 280;

const Layout = ({ children, userDetails }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [openDialog, setOpenDialog] = useState(null);

  const notifications = [
    { id: 1, message: 'New appointment request from Sarah Johnson', time: '5 min ago' },
    { id: 2, message: 'Reminder: Michael Chen appointment in 30 minutes', time: '25 min ago' },
    { id: 3, message: 'Lab results ready for Emily Rodriguez', time: '1 hour ago' }
  ];

  const menuItems = userDetails?.role === 'doctor' ? [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'My Schedule', icon: <Schedule />, path: '/schedule' },
    { text: 'Patient Records', icon: <People />, path: '/patient-records' },
    { text: 'Analysis History', icon: <History />, path: '/analysis-history' },
    { text: 'Reports', icon: <Assessment />, path: '/reports' },
    { text: 'Settings', icon: <Settings />, path: '/settings' }
  ] : [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Book Appointment', icon: <Schedule />, path: '/appointments' },
    { text: 'External Booking', icon: <LocalHospital />, path: '/external-booking' },
    { text: 'Health Records', icon: <Assessment />, path: '/health-records' },
    { text: 'Medical History', icon: <History />, path: '/medical-history' },
    { text: 'Settings', icon: <Settings />, path: '/settings' }
  ];

  const getBreadcrumbs = () => {
    const pathMap = {
      '/dashboard': 'Dashboard',
      '/schedule': 'My Schedule',
      '/patient-records': 'Patient Records',
      '/analysis-history': 'Analysis History',
      '/reports': 'Reports',
      '/appointments': 'Book Appointment',
      '/external-booking': 'External Booking',
      '/health-records': 'Health Records',
      '/medical-history': 'Medical History',
      '/settings': 'Settings'
    };

    const currentPath = location.pathname;
    const breadcrumbs = [
      <Link key="dashboard" color="inherit" href="/dashboard" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
        Dashboard
      </Link>
    ];

    if (currentPath !== '/dashboard' && pathMap[currentPath]) {
      breadcrumbs.push(
        <Typography key={currentPath} color="text.primary" sx={{ fontWeight: 600 }}>
          {pathMap[currentPath]}
        </Typography>
      );
    }

    return breadcrumbs;
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const drawer = (
    <Box>
      <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2E7D32' }}>
          AFI Health
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {userDetails?.role === 'doctor' ? 'Doctor Portal' : 'Patient Portal'}
        </Typography>
      </Box>
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: '#2E7D3215',
                  color: '#2E7D32',
                  '& .MuiListItemIcon-root': { color: '#2E7D32' }
                },
                '&:hover': {
                  bgcolor: '#f8fafc'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          color: '#1e293b',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <Breadcrumbs
              separator={<NavigateNext fontSize="small" />}
              sx={{ '& .MuiBreadcrumbs-separator': { color: '#64748b' } }}
            >
              {getBreadcrumbs()}
            </Breadcrumbs>
          </Box>

          <IconButton
            onClick={(e) => setNotificationAnchor(e.currentTarget)}
            sx={{ mr: 2 }}
          >
            <Badge badgeContent={notifications.length} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#2E7D32', fontSize: '0.9rem' }}>
              {userDetails?.full_name?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>

          {/* Profile Menu */}
          <Menu
            anchorEl={profileAnchor}
            open={Boolean(profileAnchor)}
            onClose={() => setProfileAnchor(null)}
          >
            <MenuItem onClick={() => { navigate('/settings'); setProfileAnchor(null); }}>
              <Person sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem onClick={() => navigate('/settings')}>
              <Settings sx={{ mr: 1 }} /> Settings
            </MenuItem>
            <MenuItem onClick={() => { setOpenDialog('help'); setProfileAnchor(null); }}>
              <Help sx={{ mr: 1 }} /> Help & Support
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={() => setNotificationAnchor(null)}
            PaperProps={{ sx: { width: 350, maxHeight: 400 } }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Notifications</Typography>
            </Box>
            {notifications.map((notification) => (
              <MenuItem key={notification.id} sx={{ p: 2, alignItems: 'flex-start', whiteSpace: 'normal' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
            <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
              <Typography variant="button" sx={{ color: '#2E7D32', cursor: 'pointer' }}>
                View All Notifications
              </Typography>
            </Box>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none', boxShadow: '1px 0 3px rgba(0,0,0,0.1)' }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px'
        }}
      >
        {children}
      </Box>

      {/* Help & Support Dialog */}
      <Dialog open={openDialog === 'help'} onClose={() => setOpenDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Help & Support</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Contact Information</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>📧 Email: support@afihealth.com</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>📞 Phone: +1 (555) 123-4567</Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>🕒 Hours: Mon-Fri 9AM-6PM EST</Typography>
          
          <Typography variant="h6" sx={{ mb: 2 }}>Quick Help</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>• Upload ultrasound images in JPG, PNG, or DICOM format</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>• View analysis results in the dashboard</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>• Manage appointments in the schedule section</Typography>
          <Typography variant="body2">• Access patient records and history</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)} variant="contained" sx={{ bgcolor: '#2E7D32' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Layout;