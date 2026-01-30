import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert
} from '@mui/material';
import { Schedule, Person, AccessTime, CalendarToday, Add, Edit, Delete } from '@mui/icons-material';

const DoctorSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      time: '09:00',
      patient: 'Sarah Johnson',
      type: 'Consultation',
      duration: '30 min',
      status: 'confirmed'
    },
    {
      id: 2,
      time: '10:00',
      patient: 'Michael Chen',
      type: 'Follow-up',
      duration: '20 min',
      status: 'confirmed'
    },
    {
      id: 3,
      time: '11:30',
      patient: 'Emily Rodriguez',
      type: 'Ultrasound Review',
      duration: '45 min',
      status: 'pending'
    },
    {
      id: 4,
      time: '14:00',
      patient: 'David Wilson',
      type: 'Consultation',
      duration: '30 min',
      status: 'confirmed'
    },
    {
      id: 5,
      time: '15:30',
      patient: 'Lisa Anderson',
      type: 'Emergency',
      duration: '60 min',
      status: 'urgent'
    }
  ]);
  const [openDialog, setOpenDialog] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    time: '',
    patient: '',
    type: 'Consultation',
    duration: '30 min'
  });
  const [message, setMessage] = useState('');

  const handleAddAppointment = () => {
    const id = Math.max(...appointments.map(a => a.id)) + 1;
    setAppointments([...appointments, { ...newAppointment, id, status: 'confirmed' }]);
    setNewAppointment({ time: '', patient: '', type: 'Consultation', duration: '30 min' });
    setOpenDialog(null);
    setMessage('Appointment added successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteAppointment = (id) => {
    setAppointments(appointments.filter(a => a.id !== id));
    setMessage('Appointment deleted successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleStatusChange = (id, newStatus) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
    setMessage('Appointment status updated!');
    setTimeout(() => setMessage(''), 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'urgent': return 'error';
      default: return 'default';
    }
  };

  const todayStats = {
    total: appointments.length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    pending: appointments.filter(a => a.status === 'pending').length,
    urgent: appointments.filter(a => a.status === 'urgent').length
  };

  return (
    <Box sx={{ p: 4, maxWidth: '1400px', mx: 'auto' }}>
      {message && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {message}
        </Alert>
      )}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, bgcolor: '#2E7D32', color: 'white' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          My Schedule
        </Typography>
        <Typography variant="h6">
          Manage your appointments and availability
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: 3, mb: 3 }}>
            <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Today's Appointments
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenDialog('add')}
                sx={{ bgcolor: '#2E7D32' }}
              >
                Add Appointment
              </Button>
            </Box>

            <List>
              {appointments.map((appointment, index) => (
                <React.Fragment key={appointment.id}>
                  <ListItem sx={{ p: 3, alignItems: 'flex-start' }}>
                    <ListItemIcon sx={{ mt: 1 }}>
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: '50%', 
                        bgcolor: '#2E7D3215', 
                        color: '#2E7D32' 
                      }}>
                        <AccessTime />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {appointment.time} - {appointment.patient}
                          </Typography>
                          <Chip 
                            label={appointment.status} 
                            color={getStatusColor(appointment.status)}
                            size="small"
                            sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {appointment.type} • {appointment.duration}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                              size="small" 
                              variant="outlined" 
                              onClick={() => handleStatusChange(appointment.id, appointment.status === 'confirmed' ? 'pending' : 'confirmed')}
                              sx={{ color: '#2E7D32', borderColor: '#2E7D32' }}
                            >
                              {appointment.status === 'confirmed' ? 'Mark Pending' : 'Confirm'}
                            </Button>
                            <Button 
                              size="small" 
                              variant="text" 
                              onClick={() => handleDeleteAppointment(appointment.id)}
                              sx={{ color: '#d32f2f' }}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < appointments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Today's Overview
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card sx={{ textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#2E7D32' }}>
                      {todayStats.total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976D2' }}>
                      {todayStats.confirmed}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Confirmed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#ED6C02' }}>
                      {todayStats.pending}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#d32f2f' }}>
                      {todayStats.urgent}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Urgent
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setOpenDialog('add')}
                sx={{ justifyContent: 'flex-start', p: 2 }}
              >
                Add New Appointment
              </Button>
              <Button
                variant="outlined"
                startIcon={<CalendarToday />}
                onClick={() => setOpenDialog('calendar')}
                sx={{ justifyContent: 'flex-start', p: 2 }}
              >
                View Calendar
              </Button>
              <Button
                variant="outlined"
                startIcon={<Person />}
                onClick={() => setOpenDialog('patients')}
                sx={{ justifyContent: 'flex-start', p: 2 }}
              >
                Patient List
              </Button>
              <Button
                variant="outlined"
                startIcon={<Schedule />}
                onClick={() => setOpenDialog('availability')}
                sx={{ justifyContent: 'flex-start', p: 2 }}
              >
                Set Availability
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Add Appointment Dialog */}
      <Dialog open={openDialog === 'add'} onClose={() => setOpenDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Appointment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Time"
                type="time"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration"
                select
                value={newAppointment.duration}
                onChange={(e) => setNewAppointment({...newAppointment, duration: e.target.value})}
              >
                <MenuItem value="15 min">15 minutes</MenuItem>
                <MenuItem value="30 min">30 minutes</MenuItem>
                <MenuItem value="45 min">45 minutes</MenuItem>
                <MenuItem value="60 min">60 minutes</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Patient Name"
                value={newAppointment.patient}
                onChange={(e) => setNewAppointment({...newAppointment, patient: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Appointment Type"
                select
                value={newAppointment.type}
                onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value})}
              >
                <MenuItem value="Consultation">Consultation</MenuItem>
                <MenuItem value="Follow-up">Follow-up</MenuItem>
                <MenuItem value="Ultrasound Review">Ultrasound Review</MenuItem>
                <MenuItem value="Emergency">Emergency</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>Cancel</Button>
          <Button onClick={handleAddAppointment} variant="contained" sx={{ bgcolor: '#2E7D32' }}>
            Add Appointment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Calendar Dialog */}
      <Dialog open={openDialog === 'calendar'} onClose={() => setOpenDialog(null)} maxWidth="md" fullWidth>
        <DialogTitle>Calendar View</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Today's Schedule</Typography>
            <Grid container spacing={1}>
              {Array.from({ length: 12 }, (_, i) => {
                const hour = i + 8; // 8 AM to 7 PM
                const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
                const appointment = appointments.find(a => a.time === timeSlot);
                return (
                  <Grid item xs={12} key={hour}>
                    <Paper sx={{ 
                      p: 2, 
                      bgcolor: appointment ? '#2E7D3215' : '#f8fafc',
                      border: appointment ? '2px solid #2E7D32' : '1px solid #e2e8f0'
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {timeSlot}
                        </Typography>
                        {appointment ? (
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {appointment.patient} - {appointment.type}
                            </Typography>
                            <Chip label={appointment.status} size="small" color={getStatusColor(appointment.status)} />
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Available
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog === 'patients'} onClose={() => setOpenDialog(null)}>
        <DialogTitle>Patient List</DialogTitle>
        <DialogContent>
          <List>
            {[...new Set(appointments.map(a => a.patient))].map((patient, index) => (
              <ListItem key={index}>
                <ListItemIcon><Person /></ListItemIcon>
                <ListItemText primary={patient} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog === 'availability'} onClose={() => setOpenDialog(null)}>
        <DialogTitle>Set Availability</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>Availability management coming soon.</Typography>
          <Typography variant="body2" color="text.secondary">
            Current working hours: 9:00 AM - 6:00 PM
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorSchedule;