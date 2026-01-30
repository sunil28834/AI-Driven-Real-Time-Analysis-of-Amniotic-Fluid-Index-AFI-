import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Schedule, 
  Person, 
  CalendarToday, 
  AccessTime, 
  CheckCircle, 
  LocalHospital,
  Star,
  Phone,
  Email
} from '@mui/icons-material';

const AppointmentPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [patientInfo, setPatientInfo] = useState({ name: '', phone: '', email: '' });
  const [success, setSuccess] = useState(false);
  
  const steps = ['Select Doctor', 'Choose Date & Time', 'Patient Details', 'Confirmation'];

  const doctors = [
    { 
      id: 1, 
      name: 'Dr. Sarah Johnson', 
      specialty: 'Gynecologist', 
      experience: '12 years',
      rating: 4.9,
      available: true,
      avatar: 'SJ',
      consultationFee: '$150'
    },
    { 
      id: 2, 
      name: 'Dr. Michael Chen', 
      specialty: 'Radiologist', 
      experience: '8 years',
      rating: 4.8,
      available: true,
      avatar: 'MC',
      consultationFee: '$120'
    },
    { 
      id: 3, 
      name: 'Dr. Emily Rodriguez', 
      specialty: 'Obstetrician', 
      experience: '15 years',
      rating: 4.9,
      available: false,
      avatar: 'ER',
      consultationFee: '$180'
    }
  ];

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleBooking = () => {
    setSuccess(true);
    setActiveStep(0);
    setSelectedDoctor('');
    setSelectedDate('');
    setSelectedTime('');
    setReason('');
    setPatientInfo({ name: '', phone: '', email: '' });
    setTimeout(() => setSuccess(false), 5000);
  };

  const getSelectedDoctor = () => doctors.find(d => d.id === selectedDoctor);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', p: 4, maxWidth: '1400px', mx: 'auto' }}>
      {/* Header */}
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        borderRadius: 3, 
        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Book Appointment
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Schedule your consultation with our medical specialists
          </Typography>
        </Box>
        <LocalHospital sx={{ 
          position: 'absolute', 
          right: 20, 
          top: 20, 
          fontSize: '4rem', 
          opacity: 0.2 
        }} />
      </Paper>

      {success && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            '& .MuiAlert-icon': { fontSize: '1.5rem' }
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Appointment Booked Successfully!
          </Typography>
          <Typography variant="body2">
            You will receive a confirmation email and SMS shortly. Our team will contact you 24 hours before your appointment.
          </Typography>
        </Alert>
      )}

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step Content */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ 
            p: 4, 
            borderRadius: 3, 
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            {/* Step 0: Select Doctor */}
            {activeStep === 0 && (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
                  Choose Your Doctor
                </Typography>
                <Grid container spacing={3}>
                  {doctors.map((doctor) => (
                    <Grid item xs={12} key={doctor.id}>
                      <Card 
                        sx={{ 
                          cursor: doctor.available ? 'pointer' : 'not-allowed',
                          border: selectedDoctor === doctor.id ? '2px solid #2E7D32' : '1px solid #e2e8f0',
                          opacity: doctor.available ? 1 : 0.6,
                          transition: 'all 0.3s ease',
                          '&:hover': doctor.available ? { 
                            transform: 'translateY(-2px)', 
                            boxShadow: '0 8px 25px rgba(0,0,0,0.1)' 
                          } : {}
                        }}
                        onClick={() => doctor.available && setSelectedDoctor(doctor.id)}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Avatar sx={{ 
                              width: 60, 
                              height: 60, 
                              bgcolor: '#2E7D32',
                              fontSize: '1.5rem',
                              fontWeight: 700
                            }}>
                              {doctor.avatar}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                {doctor.name}
                              </Typography>
                              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                                {doctor.specialty} • {doctor.experience} experience
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Star sx={{ color: '#fbbf24', fontSize: '1rem' }} />
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {doctor.rating}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#2E7D32' }}>
                                  {doctor.consultationFee}
                                </Typography>
                              </Box>
                              <Chip
                                label={doctor.available ? 'Available Today' : 'Unavailable'}
                                color={doctor.available ? 'success' : 'error'}
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </Box>
                            {selectedDoctor === doctor.id && (
                              <CheckCircle sx={{ color: '#2E7D32', fontSize: '2rem' }} />
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Step 1: Date & Time */}
            {activeStep === 1 && (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
                  Select Date & Time
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Preferred Date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: new Date().toISOString().split('T')[0] }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Available Time Slots</InputLabel>
                      <Select
                        value={selectedTime}
                        label="Available Time Slots"
                        onChange={(e) => setSelectedTime(e.target.value)}
                        sx={{ borderRadius: 2 }}
                      >
                        {timeSlots.map((time) => (
                          <MenuItem key={time} value={time}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AccessTime sx={{ fontSize: '1rem' }} />
                              {time}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Reason for Visit (Optional)"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Please describe your symptoms or reason for consultation..."
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Step 2: Patient Details */}
            {activeStep === 2 && (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
                  Patient Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={patientInfo.name}
                      onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={patientInfo.phone}
                      onChange={(e) => setPatientInfo({...patientInfo, phone: e.target.value})}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={patientInfo.email}
                      onChange={(e) => setPatientInfo({...patientInfo, email: e.target.value})}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Step 3: Confirmation */}
            {activeStep === 3 && (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
                  Confirm Your Appointment
                </Typography>
                <Paper sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                  <List>
                    <ListItem>
                      <ListItemIcon><Person sx={{ color: '#2E7D32' }} /></ListItemIcon>
                      <ListItemText 
                        primary="Doctor" 
                        secondary={getSelectedDoctor()?.name + ' - ' + getSelectedDoctor()?.specialty}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CalendarToday sx={{ color: '#2E7D32' }} /></ListItemIcon>
                      <ListItemText 
                        primary="Date & Time" 
                        secondary={`${selectedDate} at ${selectedTime}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Phone sx={{ color: '#2E7D32' }} /></ListItemIcon>
                      <ListItemText 
                        primary="Patient" 
                        secondary={`${patientInfo.name} - ${patientInfo.phone}`}
                      />
                    </ListItem>
                    {reason && (
                      <ListItem>
                        <ListItemIcon><Schedule sx={{ color: '#2E7D32' }} /></ListItemIcon>
                        <ListItemText 
                          primary="Reason" 
                          secondary={reason}
                        />
                      </ListItem>
                    )}
                  </List>
                </Paper>
              </Box>
            )}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={activeStep === steps.length - 1 ? handleBooking : handleNext}
                disabled={
                  (activeStep === 0 && !selectedDoctor) ||
                  (activeStep === 1 && (!selectedDate || !selectedTime)) ||
                  (activeStep === 2 && (!patientInfo.name || !patientInfo.phone || !patientInfo.email))
                }
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  bgcolor: '#2E7D32',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#1B5E20' }
                }}
              >
                {activeStep === steps.length - 1 ? 'Book Appointment' : 'Next'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Booking Summary */}
          <Paper sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 3, 
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>
              Booking Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {selectedDoctor && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Doctor</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {getSelectedDoctor()?.name}
                </Typography>
              </Box>
            )}
            {selectedDate && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Date</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {new Date(selectedDate).toLocaleDateString()}
                </Typography>
              </Box>
            )}
            {selectedTime && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Time</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedTime}
                </Typography>
              </Box>
            )}
            {selectedDoctor && (
              <Box sx={{ mt: 3, p: 2, bgcolor: '#2E7D3215', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">Consultation Fee</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2E7D32' }}>
                  {getSelectedDoctor()?.consultationFee}
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Contact Info */}
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3, 
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>
              Need Help?
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Phone sx={{ color: '#2E7D32' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Call us</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>+1 (555) 123-4567</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Email sx={{ color: '#2E7D32' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Email us</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>support@afihealth.com</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppointmentPage;