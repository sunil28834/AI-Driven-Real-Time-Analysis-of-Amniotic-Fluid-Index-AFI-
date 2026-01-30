import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import {
  LocalHospital,
  Security,
  Speed,
  People
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <LocalHospital sx={{ fontSize: 40, color: '#2E7D32' }} />,
      title: 'Medical Excellence',
      description: 'Advanced AFI classification using AI technology for accurate diagnosis'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#2E7D32' }} />,
      title: 'Secure & Private',
      description: 'Your medical data is protected with enterprise-grade security'
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: '#2E7D32' }} />,
      title: 'Fast Results',
      description: 'Get instant analysis results with high accuracy predictions'
    },
    {
      icon: <People sx={{ fontSize: 40, color: '#2E7D32' }} />,
      title: 'Doctor Appointments',
      description: 'Book appointments with qualified doctors seamlessly'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#2E7D32', fontWeight: 'bold' }}>
            AFI Health
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => navigate('/auth')}
            sx={{ color: '#2E7D32', mr: 2 }}
          >
            Login
          </Button>
          <Button 
            variant="contained" 
            onClick={() => navigate('/auth')}
            sx={{ 
              bgcolor: '#2E7D32', 
              '&:hover': { bgcolor: '#1B5E20' },
              borderRadius: '25px'
            }}
          >
            Get Started
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold', 
                color: '#1B5E20',
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Advanced AFI Classification
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary" 
              paragraph
              sx={{ mb: 4, lineHeight: 1.6 }}
            >
              Professional medical imaging analysis with AI-powered accuracy. 
              Connect with doctors and get instant ultrasound image classification.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/auth')}
                sx={{
                  bgcolor: '#2E7D32',
                  '&:hover': { bgcolor: '#1B5E20' },
                  borderRadius: '30px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                Start Analysis
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/auth')}
                sx={{
                  borderColor: '#2E7D32',
                  color: '#2E7D32',
                  borderRadius: '30px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': { borderColor: '#1B5E20', bgcolor: 'rgba(46, 125, 50, 0.04)' }
                }}
              >
                Book Appointment
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/ultra.jpg"
              alt="Medical Analysis"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          align="center" 
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#1B5E20', mb: 6 }}
        >
          Why Choose AFI Health?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  borderRadius: '15px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-5px)' }
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1B5E20' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: '#2E7D32', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" paragraph sx={{ color: 'rgba(255,255,255,0.9)', mb: 4 }}>
            Join thousands of healthcare professionals using our platform
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/auth')}
            sx={{
              bgcolor: 'white',
              color: '#2E7D32',
              borderRadius: '30px',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
          >
            Get Started Today
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;