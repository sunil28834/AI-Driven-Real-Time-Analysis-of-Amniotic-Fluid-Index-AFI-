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
  Link
} from '@mui/material';
import { Launch, Search, LocationOn, Star, Schedule } from '@mui/icons-material';

const PractoIntegration = () => {
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const mockDoctors = [
    {
      id: 1,
      name: 'Dr. Priya Sharma',
      specialty: 'Gynecologist',
      experience: '15 years',
      rating: 4.8,
      location: 'Mumbai',
      hospital: 'Apollo Hospital',
      fee: '₹800',
      available: true,
      practoUrl: 'https://www.practo.com/mumbai/doctor/priya-sharma-gynecologist'
    },
    {
      id: 2,
      name: 'Dr. Rajesh Kumar',
      specialty: 'Radiologist',
      experience: '12 years',
      rating: 4.6,
      location: 'Delhi',
      hospital: 'Max Healthcare',
      fee: '₹600',
      available: true,
      practoUrl: 'https://www.practo.com/delhi/doctor/rajesh-kumar-radiologist'
    },
    {
      id: 3,
      name: 'Dr. Sunita Patel',
      specialty: 'Obstetrician',
      experience: '18 years',
      rating: 4.9,
      location: 'Bangalore',
      hospital: 'Fortis Hospital',
      fee: '₹1000',
      available: false,
      practoUrl: 'https://www.practo.com/bangalore/doctor/sunita-patel-obstetrician'
    }
  ];

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setSearchResults(mockDoctors.filter(doctor => 
        (!location || doctor.location.toLowerCase().includes(location.toLowerCase())) &&
        (!specialty || doctor.specialty.toLowerCase().includes(specialty.toLowerCase()))
      ));
      setLoading(false);
    }, 1000);
  };

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, bgcolor: '#1976D2', color: 'white' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          External Booking - Practo Integration
        </Typography>
        <Typography variant="h6">
          Find and book appointments with specialists on Practo
        </Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        This feature integrates with Practo to help you find and book appointments with external specialists. 
        You'll be redirected to Practo's website to complete your booking.
      </Alert>

      <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Search Doctors
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter city name..."
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Specialty</InputLabel>
              <Select
                value={specialty}
                label="Specialty"
                onChange={(e) => setSpecialty(e.target.value)}
              >
                <MenuItem value="">All Specialties</MenuItem>
                <MenuItem value="gynecologist">Gynecologist</MenuItem>
                <MenuItem value="obstetrician">Obstetrician</MenuItem>
                <MenuItem value="radiologist">Radiologist</MenuItem>
                <MenuItem value="pediatrician">Pediatrician</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          size="large"
          onClick={handleSearch}
          disabled={loading}
          startIcon={<Search />}
          sx={{ bgcolor: '#1976D2' }}
        >
          {loading ? 'Searching...' : 'Search Doctors'}
        </Button>
      </Paper>

      {searchResults.length > 0 && (
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Search Results ({searchResults.length} doctors found)
          </Typography>
          
          <Grid container spacing={3}>
            {searchResults.map((doctor) => (
              <Grid item xs={12} md={6} key={doctor.id}>
                <Card sx={{ 
                  borderRadius: 3, 
                  border: '1px solid #e2e8f0',
                  '&:hover': { boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {doctor.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {doctor.specialty} • {doctor.experience} experience
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Star sx={{ fontSize: '1rem', color: '#ED6C02' }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {doctor.rating}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={doctor.available ? 'Available' : 'Busy'}
                        color={doctor.available ? 'success' : 'error'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocationOn sx={{ fontSize: '1rem', color: '#64748b' }} />
                        <Typography variant="body2" color="text.secondary">
                          {doctor.hospital}, {doctor.location}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2E7D32' }}>
                        Consultation Fee: {doctor.fee}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Schedule />}
                        disabled={!doctor.available}
                        sx={{ bgcolor: '#2E7D32', flex: 1 }}
                        onClick={() => window.open(doctor.practoUrl, '_blank')}
                      >
                        Book on Practo
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Launch />}
                        sx={{ color: '#1976D2', borderColor: '#1976D2' }}
                        onClick={() => window.open(doctor.practoUrl, '_blank')}
                      >
                        View Profile
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {searchResults.length === 0 && location && (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Search sx={{ fontSize: '4rem', color: '#94a3b8', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No doctors found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or location
          </Typography>
        </Paper>
      )}

      <Paper sx={{ p: 3, mt: 4, borderRadius: 3, bgcolor: '#f8fafc' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          About Practo Integration
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Practo is India's leading healthcare platform that connects patients with doctors and healthcare providers. 
          Through this integration, you can:
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body2" color="text.secondary">
            Search for specialists in your area
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            View doctor profiles, ratings, and availability
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            Book appointments directly on Practo's platform
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            Access telemedicine consultations
          </Typography>
        </Box>
        <Link href="https://www.practo.com" target="_blank" sx={{ color: '#1976D2', fontWeight: 500 }}>
          Visit Practo.com →
        </Link>
      </Paper>
    </Box>
  );
};

export default PractoIntegration;